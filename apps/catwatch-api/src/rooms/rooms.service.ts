import { UserProfile } from '@catstack/catwatch/types';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

import { Room } from './entity';

@Injectable()
export class RoomsService {
  private rooms = new Map<Room['id'], Room>([['1', new Room('1')]]);

  createRoom() {
    const createdRoom = new Room(nanoid(4));
    this.rooms.set(createdRoom.id, createdRoom);
    return createdRoom;
  }

  getRoom(id: string) {
    if (!this.rooms.has(id)) {
      throw new HttpException('Room not found!', HttpStatus.NOT_FOUND);
    }

    return this.rooms.get(id);
  }

  deleteRoom(id: string) {
    if (!this.rooms.has(id)) {
      throw new HttpException('Room not found!', HttpStatus.NOT_FOUND);
    }

    return this.rooms.delete(id);
  }

  joinRoom(roomId: string, user: UserProfile) {
    if (!this.rooms.has(roomId)) {
      throw new HttpException('Room not found!', HttpStatus.NOT_FOUND);
    }

    this.getRoom(roomId).addUser(user);
  }

  leaveRoom(roomId: string, userId: number) {
    if (!this.rooms.has(roomId)) {
      throw new HttpException('Room not found!', HttpStatus.NOT_FOUND);
    }

    this.getRoom(roomId).removeUser(userId);
  }

  getRoomUsers(roomId: string) {
    const room = this.getRoom(roomId);
    const users = [...room.users.values()];

    return users;
  }
}
