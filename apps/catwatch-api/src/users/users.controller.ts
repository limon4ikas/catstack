import { Prisma } from '@catstack/catwatch/models';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: Prisma.UserUpdateInput) {
    return this.usersService.updateUser({ where: { id }, data });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.deleteUser({ id });
  }
}
