import 'dotenv/config';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import mongoose from 'mongoose';

/**
 * Test ma'lumotlarini bazaga yozadi.
 * Ishga tushirish: npm run seed
 */
const seed = async () => {
  await connectDB();

  await User.deleteMany();
  await Product.deleteMany();

  await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  });

  await Product.insertMany([
    { name: 'Telefon', description: 'Smartfon', price: 3500000, stock: 10 },
    { name: 'Noutbuk', description: 'Ishchi noutbuk', price: 9000000, stock: 5 },
    { name: 'Quloqchin', description: 'Simsiz quloqchin', price: 450000, stock: 30 },
  ]);

  console.log('✅ Seed tugadi. Admin: admin@example.com / admin123');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((e) => {
  console.error('Seed xatosi:', e.message);
  process.exit(1);
});
