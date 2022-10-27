export class Room {
  sockets: Set<string> = new Set();

  constructor(public readonly id: string) {}

  addSocket(socketId: string) {
    this.sockets.add(socketId);
  }

  removeSocket(socketId: string) {
    this.sockets.delete(socketId);
  }
}
