import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config()
/**
 * MongoDB ulanishi.
 * Xato bo'lsa — process'ni to'xtatamiz, chunki DB'siz server ishlamaydi.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB ulandi: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB ulanish xatosi: ${error.message}`);
    process.exit(1);
  }
};
