import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { nanoid } from 'nanoid';

import { Services } from '../constants';

import { Room } from './entity';

@Injectable()
export class RoomsService {
  private logger = new Logger(Services.RoomService);

  private rooms = new Map<Room['id'], Room>();

  create() {
    const createdRoom = new Room(nanoid());

    this.logger.log(`Created room ${createdRoom.id}`);
    this.logger.log([...this.rooms.values()]);

    this.rooms.set(createdRoom.id, createdRoom);

    return createdRoom;
  }

  findAll() {
    return [...this.rooms.values()];
  }

  findOne(id: string) {
    if (!this.rooms.has(id)) {
      throw new HttpException('Not found!', HttpStatus.NOT_FOUND);
    }

    return this.rooms.get(id);
  }

  remove(id: string) {
    if (!this.rooms.has(id)) {
      throw new HttpException('Not found!', HttpStatus.NOT_FOUND);
    }

    return this.rooms.delete(id);
  }
}
