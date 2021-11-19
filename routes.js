const router = require('express').Router();
const authMiddleware = require('./middlewares/auth');

router.use('/auth', require('./features/auth/auth.routes'));

router.use(authMiddleware);

module.exports = router;
