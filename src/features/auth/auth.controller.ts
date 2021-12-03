import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from './models/User';
import ConflictError from '../../utils/httpErrors/ConflictError';
import NotFoundError from '../../utils/httpErrors/NotFoundError';

import { RequestHandler } from 'express';
import UnauthorizedError from '../../utils/httpErrors/UnauthorizedError';
import Mail from '../../utils/Mailer';
import jsonwebtoken from 'jsonwebtoken';
import { verifyEmailTemplate } from '../../utils/serviceEmailTemplates/verifyEmail';
import { resetPasswordTemplate } from '../../utils/serviceEmailTemplates/resetPassword';
import { getUserByCredentials, getUserByID } from './auth.service';

const JWT_SECRET_MAILER =
  process.env.NODE_ENV !== 'production'
    ? 'dev-key-mailer'
    : process.env.JWT_SECRET_MAILER;

const JWT_SECRET_TOKEN =
  process.env.NODE_ENV !== 'production'
    ? 'dev-key'
    : process.env.JWT_SECRET_TOKEN;

if (!JWT_SECRET_MAILER) {
  throw new Error('JWT_SECRET_MAILER in production mode must be defined');
}

if (!JWT_SECRET_TOKEN) {
  throw new Error('JWT_SECRET_TOKEN in production mode must be defined');
}

export const checkAuth: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) return next(new UnauthorizedError())

    const user = await getUserByID(req.userId)

    return res.json({ data: user });
  } catch (e) {
    return next(e);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const user = await getUserByCredentials(req.body.email, req.body.password)

    const { rememberMe = false } = req.body;

    const token = jwt.sign({ _id: user._id }, JWT_SECRET_TOKEN, {
      expiresIn: rememberMe ? '7d' : '2h',
    });

    res.cookie('jwt', token, {
      maxAge: 3600000 * (rememberMe ? (24 * 7) : 2),
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    });

    return res.json({
      data: user,
    });
  } catch (e) {
    next(e)
  }
}

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const user = await UserModel.findOne({ email }).exec()

    if (user) {
      return next(new ConflictError(
        'Пользователь с таким email уже зарегистрирован'
      ));
    }

    const confirmToken = jwt.sign({ email }, JWT_SECRET_MAILER)
    const passwordHash = await bcrypt.hash(password, 10);
    await UserModel.create({ email, password: passwordHash, name, confirmToken });

    const mail = await Mail.sendMail(email, 'Email confirmation', verifyEmailTemplate(confirmToken))

    return res.status(201).json({
      message: mail.accepted.includes(email)
        ? `На ${email} отправлена ссылка для подтверждения`
        : mail.response
    })
  } catch (e) {
    return next(e);
  }
};

export const logout: RequestHandler = (req, res) =>
  res.clearCookie('jwt').json({ message: 'Выход выполнен' });

export const update: RequestHandler = async (req, res, next) => {
  try {
    const { email, name } = req.body

    const user = await UserModel
      .findOneAndUpdate(
        { _id: req.userId },
        { email, name },
        { new: true, runValidators: true }
      )
      .orFail(() => {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован')
      })
      .exec()

    return res.json({
      message: 'Информация пользователя обновлена',
      data: user,
    })
  } catch (e) {
    return next(e);
  }
}

export const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const { passwordOld, passwordNew } = req.body

    const isOldPasswordCorrect = await UserModel.checkUserPassword(req.userId!, passwordOld)

    if (!isOldPasswordCorrect) {
      return next(new UnauthorizedError('Старый пароль не совпадает с установленным'))
    }

    const passwordHash = await bcrypt.hash(passwordNew, 10);

    const user = await UserModel.findOneAndUpdate(
      { _id: req.userId },
      { password: passwordHash },
      { new: true, runValidators: true }
    )

    return res.json({
      message: 'Пароль успешно обновлен',
      data: user,
    })
  } catch (e) {
    next(e)
  }
}

export const verify: RequestHandler = async (req, res, next) => {
  try {
    const { token } = req.params

    const verify: jsonwebtoken.VerifyCallback<jsonwebtoken.JwtPayload> = async (err, decoded) => {
      if (err || !decoded) {
        throw new UnauthorizedError(err!.message);
      }

      if (!await UserModel.verify(decoded.email, token)) {
        throw new UnauthorizedError('Ошибка верификации токена')
      }
    }

    await jsonwebtoken.verify(token, JWT_SECRET_MAILER, verify);

    return res.json({
      message: 'Учетна запись подтверждена'
    });
  } catch (e) {
    return next(e);
  }
}

export const requestResetPassword: RequestHandler = async (req, res, next) => {
  const { email } = req.body;

  const confirmToken = jwt.sign({ email },
    JWT_SECRET_MAILER,
    { expiresIn: '1m' })
  await UserModel.setConfirmToken(email, confirmToken)

  const mail = await Mail.sendMail(email, 'Password reset', resetPasswordTemplate(confirmToken))

  return res.status(201).json({
    message: mail.accepted.includes(email)
      ? `На ${email} отправлена ссылка для сброса пароля`
      : mail.response
  })
}

export const reset: RequestHandler = async (req, res, next) => {
  try {
    const { token } = req.params

    const verify: jsonwebtoken.VerifyCallback<jsonwebtoken.JwtPayload> = async (err, decoded) => {
      if (err || !decoded) {
        throw new UnauthorizedError(err!.message);
      }

      if (!await UserModel.checkConfirmToken(decoded.email, token)) {
        throw new UnauthorizedError('Ошибка валидации токена')
      }
    }

    await jsonwebtoken.verify(token, JWT_SECRET_MAILER, verify);

    return res.json({
      message: 'Токен валиден. Можно сменить пароль'
    })
  } catch (e) {
    return next(e);
  }
}
