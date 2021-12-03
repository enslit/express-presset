import { Router } from 'express'
import {
  login,
  register,
  logout,
  checkAuth,
  update,
  changePassword,
  verify,
  requestResetPassword, reset,
} from './auth.controller';
import {
  changePasswordValidator,
  loginValidator,
  registerValidator, requestResetPasswordValidator,
  updateUserInfoValidator,
} from './request-validators';
import authMiddleware from '../../middlewares/auth';

const router = Router();

router.post('/login', loginValidator, login);
router.post('/register', registerValidator, register);
router.post('/logout', logout);
router.post('/request-reset/', requestResetPasswordValidator, requestResetPassword);
router.get('/verify/:token', verify);
router.get('/reset/:token', reset);

router.use(authMiddleware);

router.get('/check-auth', checkAuth);
router.patch('/update', updateUserInfoValidator, update);
router.patch('/change-password', changePasswordValidator, changePassword);

export default router
