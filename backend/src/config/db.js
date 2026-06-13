import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config()
/**
 * MongoDB ulanishi.
 * Xato bo'lsa — process'ni to'xtatamiz, chunki DB'siz server ishlamaydi.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://student:student123@cluster0.opn6b47.mongodb.net/aaa?appName=Cluster0",
    );
    console.log(`✅ MongoDB ulandi: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB ulanish xatosi: ${error.message}`);
    process.exit(1);
  }
};
