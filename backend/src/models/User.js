import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ism majburiy'],
      trim: true,
      minlength: [2, 'Ism kamida 2 ta belgidan iborat bo\'lsin'],
    },
    email: {
      type: String,
      required: [true, 'Email majburiy'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email formati noto\'g\'ri'],
    },
    password: {
      type: String,
      required: [true, 'Parol majburiy'],
      minlength: [6, 'Parol kamida 6 ta belgidan iborat bo\'lsin'],
      select: false, // so'rovlarda parol qaytmasin
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // Telegram bot bilan bog'lash uchun
    telegramId: {
      type: Number,
      unique: true,
      sparse: true, // null bo'lsa unique tekshirilmasin
    },
  },
  { timestamps: true }
);

// Parolni saqlashdan oldin hash qilamiz (faqat o'zgargan bo'lsa)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Kiritilgan parolni hash bilan solishtirish
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
