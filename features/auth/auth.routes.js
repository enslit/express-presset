const router = require('express').Router();
const { login, register, logout, checkAuth } = require('./auth.controller');
const { loginValidator, registerValidator } = require('./request-validators');
const authMiddleware = require('../../middlewares/auth');

router.get('/check-auth', authMiddleware, checkAuth);
router.post('/login', loginValidator, login);
router.post('/register', registerValidator, register);
router.post('/logout', logout);

module.exports = router;
