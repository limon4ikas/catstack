// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { getSocket } from '@catstack/catwatch/data-access';
import {
  ClientToServerEvents,
  Events,
  RTCSignalMessage,
  ServerToClientEvents,
} from '@catstack/catwatch/types';
import { Socket } from 'socket.io-client';

export interface CatPeerConfig {
  userId: number;
}

export class CatPeer {
  private pc: RTCPeerConnection;
  private socket: Socket<ClientToServerEvents, ServerToClientEvents>;
  private makingOffer = false;
  private ignoreOffer = false;
  currentId: number;
  remoteId?: number;
  polite: boolean;
  debug = false;

  constructor(config: CatPeerConfig) {
    // Setup
    this.currentId = config.userId;
    // FIXME: CHANGE POLITENESS
    this.polite = true;
    this.socket = getSocket();
    console.log('CREATED PEER CONNECTION');
    this.log(`⚡️ Created peer connection`);
    this.pc = new RTCPeerConnection();
    // Events
    this.socket.on(Events.WebRtc, this.handleMessage);
    this.pc.addEventListener('icecandidate', this.handleIceCandidate);
    this.pc.addEventListener('track', this.handleTrack);
    this.pc.addEventListener('negotiationneeded', this.handleNegotiation);
    this.pc.addEventListener(
      'iceconnectionstatechange',
      this.handleIceConnectionStateChange
    );
  }

  private log(message?: unknown, ...optionalParams: unknown[]) {
    if (!this.debug) return;

    console.log(message, ...optionalParams);
  }

  /**
  |--------------------------------------------------
  | MAIN API
  |--------------------------------------------------
  */

  start = async (remoteId: number) => {
    this.remoteId = remoteId;
    const { localStream, localTracks } = await this.getUserMedia();
    this.addTracksToPeerConnection(localStream, localTracks);
    await this.createOffer();
  };

  stop = () => {
    this.pc.restartIce();
  };

  destroy = () => {
    this.pc.close();
  };

  /**
  |--------------------------------------------------
  | Media
  |--------------------------------------------------
  */

  private handleTrack = (ev: RTCTrackEvent) => {
    this.log(`⚡ Got remote track`, ev.track.kind);
  };

  private addTracksToPeerConnection = (
    stream: MediaStream,
    tracks: MediaStreamTrack[]
  ) => {
    this.log(`⚡️ Attached local tracks`);
    tracks.forEach((track) => this.pc.addTrack(track, stream));
  };

  private getUserMedia = async (
    constraints: MediaStreamConstraints = { video: true }
  ) => {
    this.log(`⚡️ Getting user media`);
    const localStream = await navigator.mediaDevices.getUserMedia(constraints);
    const localTracks = localStream.getTracks();

    return { localStream, localTracks };
  };

  /**
  |--------------------------------------------------
  | SIGNALING
  |--------------------------------------------------
  */

  private handleIceConnectionStateChange = () => {
    this.log(
      `⚡️ Ice connection state change to ${this.pc.iceConnectionState}`
    );
    if (this.pc.iceConnectionState === 'failed') this.pc.restartIce();
  };

  private handleNegotiation = async (ev: Event) => {
    if (this.makingOffer) return;

    this.log(`⚡️ Negotiation start`);
    try {
      this.makingOffer = true;
      await this.pc.setLocalDescription();
      this.sendSignalMessage({
        type: 'offer',
        payload: this.pc.localDescription,
      });
    } catch (err) {
      this.log('⚡️ Failed negotiation');
      console.error(err);
    } finally {
      this.makingOffer = false;
    }
  };

  private createOffer = async () => {
    this.makingOffer = true;
    this.log(`⚡️ Created offer and set as local description`);
    const offer = await this.pc.createOffer();
    await this.getDescription(offer);
    this.makingOffer = false;
  };

  private createAnswer = () => {
    this.log(`⚡️ Created answer and set as local description`);
    this.pc.createAnswer().then(this.getDescription).catch(console.error);
  };

  private getDescription = async (desc: RTCSessionDescriptionInit) => {
    await this.pc.setLocalDescription(desc);

    const description = { type: desc.type, sdp: desc.sdp };

    if (desc.type === 'offer') {
      this.log(`⚡️ Sending offer`);
      this.sendSignalMessage({ type: 'offer', payload: description });
    }

    if (desc.type === 'answer') {
      this.log(`⚡️ Sending answer`);
      this.sendSignalMessage({ type: 'answer', payload: description });
    }
  };

  private setRemoteDescription = (desc: RTCSessionDescriptionInit) => {
    this.log(`⚡️ Setted remote description`);
    if (this.pc.currentRemoteDescription) return;
    this.pc.setRemoteDescription(new RTCSessionDescription(desc));
  };

  private addIceCandidate = (candidate: RTCIceCandidateInit) => {
    if (!candidate) return;

    this.pc.addIceCandidate(new RTCIceCandidate(candidate));
  };

  private sendSignalMessage = (
    message: Pick<RTCSignalMessage, 'payload' | 'type'>
  ) => {
    if (!this.remoteId) {
      this.log('⚡️ No remote id found 😔');
      return;
    }

    this.socket.emit(Events.WebRtc, {
      toUserId: this.remoteId,
      fromUserId: this.currentId,
      type: message.type,
      payload: message.payload,
    });
  };

  private handleIceCandidate = (ev: RTCPeerConnectionIceEvent) => {
    if (!ev.candidate) return;
    this.log(`⚡️ Sending ice candidate to remote peer`);

    this.sendSignalMessage({
      type: 'candidate',
      payload: ev.candidate.toJSON(),
    });
  };

  private handleMessage = async (message: RTCSignalMessage) => {
    const offerCollision =
      message.type === 'offer' &&
      (this.makingOffer || this.pc.signalingState !== 'stable');

    this.log(`⚡️ Offer collision`, offerCollision);
    this.ignoreOffer = !this.polite && offerCollision;

    if (this.ignoreOffer) return;

    switch (message.type) {
      case 'answer': {
        this.log(`⚡️ Got answer`);
        const answerDesc = message.payload as RTCSessionDescriptionInit;
        this.setRemoteDescription(answerDesc);
        break;
      }
      case 'offer': {
        this.log(`⚡️ Got offer from ${message.fromUserId}`);
        this.remoteId = message.fromUserId;
        const offerDesc = message.payload as RTCSessionDescriptionInit;
        this.setRemoteDescription(offerDesc);
        const { localStream, localTracks } = await this.getUserMedia();
        this.addTracksToPeerConnection(localStream, localTracks);
        this.createAnswer();
        break;
      }
      case 'candidate': {
        this.log(`⚡️ Got remote candidate message`);
        try {
          const candidate = message.payload as RTCIceCandidateInit;
          this.addIceCandidate(candidate);
        } catch (err) {
          if (!this.ignoreOffer) throw err;
        }
        break;
      }
      default: {
        break;
      }
    }
  };
}
