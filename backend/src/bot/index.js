import { Telegraf, Scenes, session } from 'telegraf';
import { registerUserCommands } from './commands/user.commands.js';
import { registerAdminCommands } from './commands/admin.commands.js';
import { orderScene } from './scenes/order.scene.js';
import { getAdminIds } from './middlewares/adminOnly.js';

/**
 * Bot bitta marta yaratiladi va eksport qilinadi.
 * Token bo'lmasa (masalan testda) — null qaytadi, server baribir ishlaydi.
 */
let bot = null;

if ("8877071327:AAHYokvw8QeIp9-e-dlJ5KhBltc-WRD5lM8") {
  bot = new Telegraf("8877071327:AAHYokvw8QeIp9-e-dlJ5KhBltc-WRD5lM8");

  // Wizard/scene'lar uchun session + stage
  const stage = new Scenes.Stage([orderScene]);
  bot.use(session());
  bot.use(stage.middleware());

  // Buyruqlarni ulash
  registerUserCommands(bot);
  registerAdminCommands(bot);

  // Global xato ushlash — bot crash bo'lmasligi uchun
  bot.catch((err, ctx) => {
    console.error(`Bot xatosi (${ctx.updateType}):`, err.message);
  });
} else {
  console.warn("⚠️  BOT_TOKEN topilmadi — Telegram bot o'chirilgan.");
}

/**
 * Botni ishga tushiradi.
 * - SERVER_URL bo'lsa  → WEBHOOK (produksiya uchun)
 * - bo'lmasa           → POLLING (lokal ishlab chiqish uchun)
 *
 * @param {import('express').Express} app - express ilovasi (webhook route uchun)
 */
export const launchBot = async (app) => {
  if (!bot) return;

  const webhookPath = '/api/bot/webhook';

  if (process.env.SERVER_URL) {
    // Produksiya: webhook
    const webhookUrl = `${process.env.SERVER_URL}${webhookPath}`;
    app.use(bot.webhookCallback(webhookPath));
    await bot.telegram.setWebhook(webhookUrl);
    console.log(`🤖 Bot WEBHOOK rejimida: ${webhookUrl}`);
  } else {
    // Lokal: polling
    bot.launch();
    console.log('🤖 Bot POLLING rejimida ishga tushdi');
  }

  // Graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

/**
 * Barcha adminlarga xabar yuboradi (ro'yxatdan o'tish / buyurtma bildirishnomalari).
 * Controller'lardan chaqiriladi. Bot o'chirilgan bo'lsa — jim o'tadi.
 * @param {string} text - Markdown matn
 */
export const notifyAdmins = async (text) => {
  if (!bot) return;
  const adminIds = getAdminIds();
  await Promise.all(
    adminIds.map((id) =>
      bot.telegram
        .sendMessage(id, text, { parse_mode: 'Markdown' })
        .catch((e) => console.error(`Adminga (${id}) yuborilmadi:`, e.message))
    )
  );
};

export { bot };
