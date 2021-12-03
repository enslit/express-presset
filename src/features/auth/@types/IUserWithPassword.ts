import { IUser } from './IUser';

export interface IUserWithPassword extends IUser {
  password: string
}