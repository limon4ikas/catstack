import { UserProfile } from '@catstack/catwatch/types';

export class Room {
  users: Map<number, UserProfile> = new Map();

  constructor(public readonly id: string) {}

  addUser(user: UserProfile) {
    this.users.set(user.id, user);
    return this;
  }

  removeUser(userId: number) {
    this.users.delete(userId);
  }
}
