import { Controller, Get, Post, Param, Delete } from '@nestjs/common';

import { Routes } from '../constants';
import { RoomsService } from './rooms.service';

@Controller(Routes.Rooms)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create() {
    return this.roomsService.createRoom();
  }

  @Get()
  findAll() {
    // return this.roomsService.getAllRooms();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.getRoom(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.deleteRoom(id);
  }

  @Get(':roomId/users')
  getRoomUsers(@Param('roomId') roomId: string) {
    return this.roomsService.getRoomUsers(roomId);
  }
}
