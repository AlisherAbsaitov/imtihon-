import { Product } from '../../models/Product.js';
import { User } from '../../models/User.js';
import { mainReplyKeyboard, linksInlineKeyboard } from '../keyboards/keyboards.js';
import { isAdmin } from '../middlewares/adminOnly.js';

/**
 * Oddiy foydalanuvchi buyruqlarini botga ulaydi.
 * Texnik topshiriq 3.1-bo'lim.
 */
export const registerUserCommands = (bot) => {
  // /start — xush kelibsiz
  bot.start(async (ctx) => {
    const adminNote = isAdmin(ctx.from.id) ? '\n\n🔐 Siz adminsiz. /admin' : '';
    await ctx.reply(
      `Assalomu alaykum, ${ctx.from.first_name}! 👋\n\n` +
        `Bu — loyiha boti. Quyidagi buyruqlardan foydalaning:\n` +
        `/help — buyruqlar ro'yxati\n` +
        `/info — profilingiz\n` +
        `/products — mahsulotlar${adminNote}`,
      mainReplyKeyboard
    );
  });

  // /help — buyruqlar ro'yxati
  bot.help((ctx) =>
    ctx.reply(
      `📋 *Buyruqlar:*\n\n` +
        `/start — boshlash\n` +
        `/help — yordam\n` +
        `/info — profilim\n` +
        `/products — mahsulotlar ro'yxati\n` +
        `/order — buyurtma berish (wizard)`,
      { parse_mode: 'Markdown' }
    )
  );

  // /info — profilni ko'rsatish (DB bilan integratsiya)
  bot.command('info', async (ctx) => {
    const user = await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
      return ctx.reply(
        'Profil topilmadi. Saytda ro\'yxatdan o\'tib, Telegram ID ingizni ' +
          'ulang.\nSizning Telegram ID: `' + ctx.from.id + '`',
        { parse_mode: 'Markdown' }
      );
    }
    await ctx.reply(
      `👤 *Profil*\nIsm: ${user.name}\nEmail: ${user.email}\nRol: ${user.role}`,
      { parse_mode: 'Markdown' }
    );
  });

  // /products va /items — mahsulotlar ro'yxati
  const productsHandler = async (ctx) => {
    const products = await Product.find().sort({ createdAt: -1 }).limit(10);
    if (products.length === 0) {
      return ctx.reply('Hozircha mahsulotlar yo\'q.');
    }
    const list = products
      .map((p, i) => `${i + 1}. *${p.name}* — ${p.price} so'm (zaxira: ${p.stock})`)
      .join('\n');
    await ctx.reply(`📦 *Mahsulotlar:*\n\n${list}`, {
      parse_mode: 'Markdown',
      ...linksInlineKeyboard(process.env.CLIENT_URL),
    });
  };
  bot.command('products', productsHandler);
  bot.command('items', productsHandler);

  // Reply keyboard tugmalari
  bot.hears('📦 Mahsulotlar', productsHandler);
  bot.hears('ℹ️ Yordam', (ctx) => ctx.reply('/help buyrug\'idan foydalaning.'));
  bot.hears('👤 Profilim', (ctx) =>
    bot.handleUpdate({ ...ctx.update, message: { ...ctx.message, text: '/info' } })
  );

  // /order — wizard scene'ga kirish
  bot.command('order', (ctx) => ctx.scene.enter('order-wizard'));

  // inline "Yangilash" tugmasi
  bot.action('refresh', (ctx) => ctx.answerCbQuery('Yangilandi ✅'));
};
