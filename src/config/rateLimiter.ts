import rateLimit from 'express-rate-limit';
import { TIME_MS } from './constants';

export const limiterConfig = rateLimit({
  windowMs: 15 * TIME_MS.minute,
  max: 50,
});
