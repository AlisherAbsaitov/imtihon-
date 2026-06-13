import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { launchBot } from './src/bot/index.js';

const PORT = process.env.PORT || 5000;

/**
 * Ishga tushirish ketma-ketligi:
 *   1) MongoDB'ga ulanish
 *   2) Express serverni ishga tushirish
 *   3) Telegram botni ulash (server bilan BITTA processda — Texnik topshiriq 3-band)
 */
const start = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server ${PORT}-portda ishlamoqda (${process.env.NODE_ENV})`);
    });

    await launchBot(app);
  } catch (error) {
    console.error('❌ Ishga tushirishda xato:', error.message);
    process.exit(1);
  }
};

start();
