import { Document } from 'mongoose'

export interface IUser extends Document {
  email: string;
  name: string;
  confirmToken: string | null;
  verified: boolean;
  isAdmin: boolean;
}