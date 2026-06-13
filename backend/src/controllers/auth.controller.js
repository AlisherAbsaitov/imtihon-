import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notifyAdmins } from '../bot/index.js';

/**
 * @route   POST /api/auth/register
 * @desc    Yangi foydalanuvchi ro'yxatdan o'tkazish
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Barcha maydonlar (name, email, password) majburiy');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('Bu email allaqachon ro\'yxatdan o\'tgan');
  }

  const user = await User.create({ name, email, password });

  // Texnik topshiriq 8-band: ro'yxatdan o'tganda botga adminlarga xabar
  notifyAdmins(`🆕 *Yangi foydalanuvchi*\nIsm: ${user.name}\nEmail: ${user.email}`);

  res.status(201).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user._id),
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Tizimga kirish
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email va parol majburiy');
  }

  // password select:false bo'lgani uchun +password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Email yoki parol noto\'g\'ri');
  }

  res.json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user._id),
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Joriy foydalanuvchi profili
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
