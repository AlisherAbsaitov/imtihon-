import { Scenes, Markup } from 'telegraf';
import { Product } from '../../models/Product.js';
import { User } from '../../models/User.js';
import { Order } from '../../models/Order.js';

/**
 * Buyurtma berish WIZARD scene (Texnik topshiriq 9-band: scenes/wizard — qo'shimcha ball).
 *
 * Bosqichlar:
 *   1) Mahsulot tanlash (inline tugmalar)
 *   2) Sonini kiritish
 *   3) Tasdiqlash va DB'ga yozish
 */
export const orderScene = new Scenes.WizardScene(
  'order-wizard',

  // 1-bosqich: mahsulotlarni ko'rsatish
  async (ctx) => {
    const products = await Product.find({ stock: { $gt: 0 } }).limit(10);
    if (products.length === 0) {
      await ctx.reply('Hozircha mavjud mahsulotlar yo\'q.');
      return ctx.scene.leave();
    }
    const buttons = products.map((p) => [
      Markup.button.callback(`${p.name} — ${p.price} so'm`, `pick:${p._id}`),
    ]);
    await ctx.reply('Mahsulotni tanlang:', Markup.inlineKeyboard(buttons));
    return ctx.wizard.next();
  },

  // 2-bosqich: son so'rash
  async (ctx) => {
    if (!ctx.callbackQuery?.data?.startsWith('pick:')) {
      await ctx.reply('Iltimos, tugmalardan birini tanlang.');
      return; // shu bosqichda qolamiz
    }
    const productId = ctx.callbackQuery.data.split(':')[1];
    ctx.wizard.state.productId = productId;
    await ctx.answerCbQuery();
    await ctx.reply('Nechta dona kerak? (raqam kiriting)');
    return ctx.wizard.next();
  },

  // 3-bosqich: tasdiqlash va saqlash
  async (ctx) => {
    const qty = Number(ctx.message?.text);
    if (!qty || qty < 1) {
      await ctx.reply('Iltimos, to\'g\'ri raqam kiriting.');
      return;
    }

    try {
      const product = await Product.findById(ctx.wizard.state.productId);
      const user = await User.findOne({ telegramId: ctx.from.id });

      if (!product) {
        await ctx.reply('Mahsulot topilmadi.');
        return ctx.scene.leave();
      }
      if (!user) {
        await ctx.reply('Avval saytda ro\'yxatdan o\'ting va /info orqali bog\'laning.');
        return ctx.scene.leave();
      }
      if (product.stock < qty) {
        await ctx.reply(`Kechirasiz, faqat ${product.stock} dona mavjud.`);
        return ctx.scene.leave();
      }

      const total = product.price * qty;
      await Order.create({
        user: user._id,
        items: [{ product: product._id, name: product.name, price: product.price, qty }],
        total,
      });
      product.stock -= qty;
      await product.save();

      await ctx.reply(
        `✅ Buyurtma qabul qilindi!\n${product.name} × ${qty} = ${total} so'm`
      );
    } catch (err) {
      console.error('Order scene xatosi:', err.message);
      await ctx.reply('Xatolik yuz berdi, qayta urinib ko\'ring.');
    }
    return ctx.scene.leave();
  }
);
