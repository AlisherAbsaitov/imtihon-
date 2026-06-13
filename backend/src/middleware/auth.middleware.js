import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * `protect` — JWT token tekshiradi va req.user ga foydalanuvchini qo'yadi.
 * Header: Authorization: Bearer <token>
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Avtorizatsiya talab qilinadi (token yo\'q)');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      throw new Error('Foydalanuvchi topilmadi');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Token yaroqsiz yoki muddati o\'tgan');
  }
});

/**
 * `admin` — protect dan keyin ishlatiladi, faqat admin role'ga ruxsat beradi.
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403);
  throw new Error('Ruxsat yo\'q: faqat admin uchun');
};
