import { User } from '@catstack/catwatch/models';

export type UserProfile = Pick<User, 'id' | 'username'>;
