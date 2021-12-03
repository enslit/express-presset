import { Router } from 'express'
import authMiddleware from './middlewares/auth';
import authRoutes from './features/auth/auth.routes'

export const restRouterV1 = Router();

restRouterV1.use('/auth', authRoutes);
restRouterV1.use(authMiddleware);

