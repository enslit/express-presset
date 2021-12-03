import bcrypt from 'bcrypt';
require('dotenv').config();
import { Schema, model, Model } from 'mongoose';
import { emailRegExp } from '../../../utils/regExp';

import UnauthorizedError from '../../../utils/httpErrors/UnauthorizedError';

import { IUserWithPassword } from '../@types/IUserWithPassword';
import NotFoundError from '../../../utils/httpErrors/NotFoundError';

interface UserModel extends Model<IUserWithPassword> {
  findUserByCredentials: (email: string, password: string) => Promise<IUserWithPassword>
  checkUserPassword: (userId: string, password: string) => Promise<boolean>
  verify: (email: string, inputToken: string) => Promise<boolean>
  setConfirmToken: (email: string, inputToken: string) => Promise<boolean>
  checkConfirmToken: (email: string, inputToken: string) => Promise<boolean>
}

const userSchema = new Schema<
  IUserWithPassword,
  UserModel
>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v: string): boolean {
        return emailRegExp.test(v);
      },
      message: 'Не корректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  confirmToken: {
    type: String,
    default: null,
    select: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const WRONG_CREDENTIALS_MESSAGE = 'Неверный email или пароль'

userSchema.static('findUserByCredentials', async function(email: string, password: string): Promise<IUserWithPassword | void> {
  const findUser: IUserWithPassword = await this.findOne({ email })
    .orFail(() => {
      throw new UnauthorizedError(WRONG_CREDENTIALS_MESSAGE);
    })
    .select('+password')

  const matchedPassword = await bcrypt.compare(password, findUser.password)

  if (!matchedPassword) {
    throw new UnauthorizedError(WRONG_CREDENTIALS_MESSAGE);
  }

  return findUser
})

userSchema.static('checkUserPassword', async function(userId: string, password: string): Promise<boolean> {
  const findUser: IUserWithPassword = await this.findOne({ _id: userId })
    .orFail(() => {
      throw new UnauthorizedError(WRONG_CREDENTIALS_MESSAGE);
    })
    .select('+password')

  return await bcrypt.compare(password, findUser.password)
})

userSchema.static('verify', async function(email: string, inputToken: string): Promise<boolean> {
  const user = await this.findOne({ email })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .select('+confirmToken')

  if (user.confirmToken === inputToken) {
    user.confirmToken = null;
    user.verified = true;

    await user.save();
    return true
  }

  return false
})

userSchema.static('setConfirmToken', async function(email: string, token: string): Promise<boolean> {
  await this.findOneAndUpdate({ email }, { confirmToken: token })

  return true
})

userSchema.static('checkConfirmToken', async function(email: string, token: string): Promise<boolean> {
  const user = await this.findOne({ email })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .select('+confirmToken')

  return user.confirmToken === token
})

export default model<IUserWithPassword, UserModel>('User', userSchema);
