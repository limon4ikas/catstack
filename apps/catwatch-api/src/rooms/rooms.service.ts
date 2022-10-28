import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

import { Room } from './entity';

@Injectable()
export class RoomsService {
  private rooms = new Map<Room['id'], Room>();

  createRoom() {
    const createdRoom = new Room(nanoid());

    this.rooms.set(createdRoom.id, createdRoom);

    return createdRoom;
  }

  getAllRooms() {
    return [...this.rooms.values()];
  }

  getRoom(id: string) {
    if (!this.rooms.has(id)) {
      throw new HttpException('Not found!', HttpStatus.NOT_FOUND);
    }

    return this.rooms.get(id);
  }

  deleteRoom(id: string) {
    if (!this.rooms.has(id)) {
      throw new HttpException('Not found!', HttpStatus.NOT_FOUND);
    }

    return this.rooms.delete(id);
  }

  updateRoom(roomId: string, room: Room) {
    this.rooms.set(roomId, room);
  }

  joinRoom(roomId: string, socketId: string) {
    if (!this.rooms.has(roomId)) {
      throw new HttpException('Room not found!', HttpStatus.NOT_FOUND);
    }

    const room = this.rooms.get(roomId);

    room.addSocket(socketId);

    console.log(room);

    this.updateRoom(roomId, room);
  }

  leaveRoom(roomId: string, socketId: string) {
    if (!this.rooms.has(roomId)) {
      throw new HttpException('Room not found!', HttpStatus.NOT_FOUND);
    }

    const room = this.rooms.get(roomId);
    room.removeSocket(socketId);
    console.log(room);
    this.updateRoom(roomId, room);
  }
}
