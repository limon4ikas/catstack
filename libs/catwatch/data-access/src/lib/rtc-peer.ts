import {
  ClientToServerEvents,
  Events,
  RTCSignalMessage,
  ServerToClientEvents,
} from '@catstack/catwatch/types';
import { Socket } from 'socket.io-client';

export interface CatPeerConfig {
  userId: number;
  remoteUserId: number;
  isPolite: boolean;
  socket: Socket<ClientToServerEvents, ServerToClientEvents>;
}

export class CatPeer {
  pc: RTCPeerConnection;
  socket: Socket<ClientToServerEvents, ServerToClientEvents>;
  remoteId: number;
  currentId: number;
  makingOffer = false;
  ignoreOffer = false;
  polite = true;

  constructor(config: CatPeerConfig) {
    // Setup
    this.currentId = config.userId;
    this.remoteId = config.remoteUserId;
    this.polite = config.isPolite;
    this.socket = config.socket;

    console.log(`⚡️ Created peer connection`);
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

  handleIceConnectionStateChange = () => {
    console.log(
      `⚡️ Ice connection state change to ${this.pc.iceConnectionState}`
    );
    if (this.pc.iceConnectionState === 'failed') this.pc.restartIce();
  };

  handleNegotiation = async (ev: Event) => {
    if (this.makingOffer) return;

    console.log(`⚡️ Negotiation`);
    try {
      this.makingOffer = true;
      await this.pc.setLocalDescription();
      this.socket.emit(Events.WebRtc, {
        type: 'offer',
        fromUserId: this.currentId,
        toUserId: this.remoteId,
        payload: this.pc.localDescription,
      });
    } catch (err) {
      console.log('⚡️ Failed negotiation');
      console.error(err);
    } finally {
      this.makingOffer = false;
    }
  };

  getUserMedia = async (constraints?: MediaStreamConstraints) => {
    console.log(`⚡️ Getting user media`);
    const localStream = await navigator.mediaDevices.getUserMedia(constraints);
    const localTracks = localStream.getTracks();

    return { localStream, localTracks };
  };

  addTracksToPeerConnection = (
    stream: MediaStream,
    tracks: MediaStreamTrack[]
  ) => {
    console.log(`⚡️ Attached local tracks`);
    tracks.forEach((track) => this.pc.addTrack(track, stream));
  };

  start = async () => {
    const { localStream, localTracks } = await this.getUserMedia({
      audio: true,
      video: true,
    });
    await this.createOffer();
    setTimeout(() => {
      this.addTracksToPeerConnection(localStream, localTracks);
    }, 5000);
  };

  stop = (isCaller: boolean) => {
    this.pc.restartIce();
  };

  createOffer = async () => {
    this.makingOffer = true;
    console.log(`⚡️ Created offer and set as local description`);
    const offer = await this.pc.createOffer();
    await this.getDescription(offer);
    this.makingOffer = false;
  };

  createAnswer = () => {
    console.log(`⚡️ Created answer and set as local description`);
    this.pc.createAnswer().then(this.getDescription).catch(console.error);
  };

  getDescription = async (desc: RTCSessionDescriptionInit) => {
    await this.pc.setLocalDescription(desc);

    const description = { type: desc.type, sdp: desc.sdp };

    if (desc.type === 'offer') {
      console.log(`⚡️ Sending offer`);
      this.socket.emit(Events.WebRtc, {
        type: 'offer',
        fromUserId: this.currentId,
        toUserId: this.remoteId,
        payload: description,
      });
    }

    if (desc.type === 'answer') {
      console.log(`⚡️ Sending answer`);
      this.socket.emit(Events.WebRtc, {
        type: 'answer',
        fromUserId: this.currentId,
        toUserId: this.remoteId,
        payload: description,
      });
    }
  };

  setRemoteDescription = (desc: RTCSessionDescriptionInit) => {
    console.log(`⚡️ Setted remote description`);
    this.pc.setRemoteDescription(new RTCSessionDescription(desc));
  };

  addIceCandidate = (candidate: RTCIceCandidateInit) => {
    if (!candidate) return;

    this.pc.addIceCandidate(new RTCIceCandidate(candidate));
  };

  handleIceCandidate = (ev: RTCPeerConnectionIceEvent) => {
    if (!ev.candidate) return;
    console.log(`⚡️ Sending ice candidate to remote peer`);

    this.socket.emit(Events.WebRtc, {
      type: 'candidate',
      fromUserId: this.currentId,
      toUserId: this.remoteId,
      payload: ev.candidate.toJSON(),
    });
  };

  handleTrack = (ev: RTCTrackEvent) => {
    console.log(`⚡ Got remote track`, ev.track);
  };

  handleMessage = async (message: RTCSignalMessage) => {
    const offerCollision =
      message.type === 'offer' &&
      (this.makingOffer || this.pc.signalingState !== 'stable');

    console.log(`⚡️ Offer collision`, offerCollision);
    this.ignoreOffer = !this.polite && offerCollision;

    if (this.ignoreOffer) return;

    switch (message.type) {
      case 'answer': {
        const answerDesc = message.payload as RTCSessionDescriptionInit;
        this.setRemoteDescription(answerDesc);
        break;
      }
      case 'offer': {
        console.log(`⚡️ Got offer`);
        const offerDesc = message.payload as RTCSessionDescriptionInit;
        this.setRemoteDescription(offerDesc);
        const { localStream, localTracks } = await this.getUserMedia({
          audio: true,
        });
        this.addTracksToPeerConnection(localStream, localTracks);
        this.createAnswer();
        break;
      }
      case 'candidate': {
        console.log(`⚡️ Got remote candidate message`);
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
