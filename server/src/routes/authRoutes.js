const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth');
const { register, login, me } = require('../controllers/authController');

// Slow down brute-force attempts on login/register
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, try again later' },
});

router.post('/register', limiter, register);
router.post('/login', limiter, login);
router.get('/me', auth, me);

module.exports = router;
