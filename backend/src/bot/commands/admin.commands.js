import { User } from '../../models/User.js';
import { getStatsData } from '../../controllers/stats.controller.js';
import { adminOnly } from '../middlewares/adminOnly.js';
import { adminReplyKeyboard } from '../keyboards/keyboards.js';

/**
 * Admin buyruqlarini ulaydi (Texnik topshiriq 3.2 + 6-band: bot = admin panel).
 */
export const registerAdminCommands = (bot) => {
  // /admin — admin panel
  bot.command('admin', adminOnly, (ctx) =>
    ctx.reply('🔐 *Admin panel*', {
      parse_mode: 'Markdown',
      ...adminReplyKeyboard,
    })
  );

  // /stats — umumiy statistika
  const statsHandler = async (ctx) => {
    const s = await getStatsData();
    await ctx.reply(
      `📊 *Statistika*\n\n` +
        `👥 Foydalanuvchilar: ${s.users}\n` +
        `📦 Mahsulotlar: ${s.products}\n` +
        `🛒 Buyurtmalar: ${s.orders}\n` +
        `💰 Tushum: ${s.revenue.toLocaleString()} so'm`,
      { parse_mode: 'Markdown' }
    );
  };
  bot.command('stats', adminOnly, statsHandler);
  bot.hears('📊 Statistika', adminOnly, statsHandler);

  // /users — foydalanuvchilar ro'yxati
  const usersHandler = async (ctx) => {
    const users = await User.find().sort({ createdAt: -1 }).limit(20);
    if (users.length === 0) return ctx.reply('Foydalanuvchilar yo\'q.');
    const list = users
      .map((u, i) => `${i + 1}. ${u.name} — ${u.email} (${u.role})`)
      .join('\n');
    await ctx.reply(`👥 *Foydalanuvchilar (oxirgi 20):*\n\n${list}`, {
      parse_mode: 'Markdown',
    });
  };
  bot.command('users', adminOnly, usersHandler);
  bot.hears('👥 Foydalanuvchilar', adminOnly, usersHandler);

  // /broadcast — barcha foydalanuvchilarga xabar
  // Foydalanish: /broadcast Salom hammaga!
  const broadcastHandler = async (ctx, textArg) => {
    const text =
      textArg ?? ctx.message.text.replace('/broadcast', '').trim();
    if (!text) {
      return ctx.reply('Foydalanish: `/broadcast Sizning xabaringiz`', {
        parse_mode: 'Markdown',
      });
    }

    // Faqat telegramId ulangan foydalanuvchilarga yuboramiz
    const users = await User.find({ telegramId: { $ne: null } });
    let sent = 0;
    let failed = 0;

    for (const u of users) {
      try {
        await ctx.telegram.sendMessage(u.telegramId, `📢 ${text}`);
        sent++;
      } catch {
        failed++; // foydalanuvchi botni bloklagan bo'lishi mumkin
      }
    }
    await ctx.reply(`✅ Yuborildi: ${sent} ta\n❌ Xato: ${failed} ta`);
  };
  bot.command('broadcast', adminOnly, (ctx) => broadcastHandler(ctx));
  bot.hears('📢 Broadcast', adminOnly, (ctx) =>
    ctx.reply('Foydalanish: `/broadcast Sizning xabaringiz`', {
      parse_mode: 'Markdown',
    })
  );
};
