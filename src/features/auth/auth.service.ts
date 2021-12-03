import UserModel from './models/User';
import NotFoundError from '../../utils/httpErrors/NotFoundError';
import { IUser } from './@types/IUser';
import UnauthorizedError from '../../utils/httpErrors/UnauthorizedError';
import { omit } from 'lodash';
import { IUserWithPassword } from './@types/IUserWithPassword';

export const getUserByID = async (id: string): Promise<IUser> => {
  const user = await UserModel.findOne({ _id: id });

  if (!user) {
    throw new NotFoundError('Пользователь не найден');
  }

  return user
}

export const getUserByCredentials = async (email: string, password: string): Promise<Partial<IUserWithPassword>> => {
  const user = await UserModel.findUserByCredentials(email, password)

  if (!user.verified) {
    throw (new UnauthorizedError('Учетная запись не подтверждена'));
  }

  console.log('before', user);

  user.set('password', null,
    {  })

  console.log('after', user);

  return omit<IUserWithPassword>(user, 'password')
}