import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @route   PUT /api/users/profile
 * @desc    O'z profilini tahrirlash (ism, email, parol)
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    res.status(404);
    throw new Error('Foydalanuvchi topilmadi');
  }

  const { name, email, password } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password; // pre-save hook hash qiladi

  const updated = await user.save();

  res.json({
    success: true,
    user: {
      id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    },
  });
});

/**
 * @route   GET /api/users
 * @desc    Barcha foydalanuvchilar (admin)
 * @access  Private/Admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users });
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Foydalanuvchini o'chirish (admin)
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Foydalanuvchi topilmadi');
  }
  await user.deleteOne();
  res.json({ success: true, message: 'Foydalanuvchi o\'chirildi' });
});
