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
      "mongodb+srv://abdulloh:RfCiy2SUHH2dvYvm@abdulloh.wbhazru.mongodb.net/?appName=abdulloh",
    );
    console.log(`✅ MongoDB ulandi: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB ulanish xatosi: ${error.message}`);
    process.exit(1);
  }
};
