const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const ConflictError = require('../../utils/httpErrors/ConflictError');
const NotFountError = require('../../utils/httpErrors/NotFountError');

const checkAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.userId });

    if (!user) throw new NotFountError('Пользователь не найден');

    return res.json({ message: 'Авторизован', data: user });
  } catch (e) {
    return next(e);
  }
};

const login = (req, res, next) =>
  User.findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      const { _id, name, email, isAdmin } = user;
      const { rememberMe = false } = req.body;
      const JWT_SECRET_TOKEN =
        process.env.NODE_ENV !== 'production'
          ? 'dev-key'
          : process.env.JWT_SECRET_TOKEN;
      const token = jwt.sign({ _id }, JWT_SECRET_TOKEN, {
        expiresIn: rememberMe ? '7d' : '2h',
      });

      res.cookie('jwt', token, {
        maxAge: 3600000 * (rememberMe ? 24 * 7 : 2),
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production',
      });

      return res.json({
        message: 'Авторизован',
        data: { _id, name, email, isAdmin },
      });
    })
    .catch(next);

const register = async (req, res, next) => {
  const { email, password, name } = req.body;

  return User.findOne({ email })
    .exec()
    .then((user) => {
      if (user) {
        throw new ConflictError(
          'Пользователь с таким email уже зарегистрирован'
        );
      }
    })
    .then(() => bcrypt.hash(password, 10))
    .then((passwordHash) =>
      User.create({
        email,
        password: passwordHash,
        name,
      })
    )
    .then(({ _id }) =>
      res.status(201).json({
        message: 'Регистрация прошла успешно',
        data: { _id, name, email },
      })
    )
    .catch(next);
};

const logout = (req, res) =>
  res.clearCookie('jwt').json({ message: 'Выход выполнен' });

module.exports = {
  logout,
  login,
  register,
  checkAuth,
};
