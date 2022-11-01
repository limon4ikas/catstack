import {
  ClientToServerEvents,
  Events,
  RTCSignalMessage,
  ServerToClientEvents,
} from '@catstack/catwatch/types';
import { Socket } from 'socket.io-client';

import { getSocket } from './socket';

export class CatPeer {
  pc: RTCPeerConnection;
  socket: Socket<ClientToServerEvents, ServerToClientEvents>;
  remoteId: number;
  currentId: number;
  dc: RTCDataChannel | undefined;
  signalingState: RTCSignalingState | 'new' = 'new';

  constructor(currentId: number, remoteId: number) {
    this.remoteId = remoteId;
    this.currentId = currentId;
    this.socket = getSocket();
    console.log(`⚡️ Created peer connection`);
    this.pc = new RTCPeerConnection();
    this.pc.addEventListener('icecandidate', this.handleIceCandidate);
    this.pc.addEventListener('track', this.handleTrack);
    this.socket.on(Events.WebRtc, this.handleMessage);
  }

  getUserMedia = async () => {
    console.log(`⚡️ Attached local tracks`);
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const localTracks = localStream.getTracks();
    localTracks.forEach((track) => this.pc.addTrack(track, localStream));
  };

  start = async () => {
    await this.getUserMedia();
    await this.createOffer();
  };

  stop = (isCaller: boolean) => {
    this.pc.restartIce();
  };

  createOffer = async () => {
    console.log(`⚡️ Created offer and set as local description`);
    const offer = await this.pc.createOffer();
    this.getDescription(offer);
  };

  createAnswer = () => {
    console.log(`⚡️ Created answer and set as local description`);
    this.pc.createAnswer().then(this.getDescription).catch(console.error);
  };

  getDescription = (desc: RTCSessionDescriptionInit) => {
    this.pc.setLocalDescription(desc);

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
    console.log(`⚡ Got remote track`, ev.track.kind);
  };

  handleMessage = async (message: RTCSignalMessage) => {
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
        await this.getUserMedia();
        this.createAnswer();
        break;
      }
      case 'candidate': {
        console.log(`⚡️ Got remote candidate message`);
        const candidate = message.payload as RTCIceCandidateInit;
        this.addIceCandidate(candidate);
        break;
      }
      default: {
        return;
      }
    }
  };
}
