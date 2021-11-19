const bcrypt = require('bcrypt');
const { Schema, model } = require('mongoose');
const { emailRegExp } = require('../../../utils/regExp');

const UnauthorizedError = require('../../../utils/httpErrors/UnauthorizedError');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
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
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .orFail(() => {
      throw new UnauthorizedError('Неверный email или пароль');
    })
    .select('+password')
    .then((user) =>
      bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неверный email или пароль');
        }

        return user;
      })
    );
};

module.exports = model('User', userSchema);
