import jwt from 'jsonwebtoken';

/**
 * Foydalanuvchi ID'si asosida JWT token yaratadi.
 * @param {string} userId - Mongoose _id
 * @returns {string} imzolangan JWT
 */
export const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
