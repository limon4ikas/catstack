import { Injectable } from '@nestjs/common';

import { Prisma, User } from '@catstack/catwatch/models';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  createUser(data: Prisma.UserCreateInput) {
    this.prisma.user.create({ data });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;

    return this.prisma.user.update({ data, where });
  }

  async findById(userId: number): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { username } });
  }
}
