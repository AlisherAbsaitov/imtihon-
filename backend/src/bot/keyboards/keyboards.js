import { Markup } from "telegraf";

// Reply keyboard — oddiy foydalanuvchi
export const mainReplyKeyboard = Markup.keyboard([
  ["📦 Mahsulotlar", "👤 Profilim"],
  ["ℹ️ Yordam"],
]).resize();

// Reply keyboard — admin
export const adminReplyKeyboard = Markup.keyboard([
  ["📊 Statistika", "👥 Foydalanuvchilar"],
  ["📢 Broadcast", "📦 Mahsulotlar"],
]).resize();

/**
 * Inline keyboard. URL tugma FAQAT valid public URL bo'lsa qo'shiladi.
 * Telegram localhost / noto'g'ri URL'larni rad etadi.
 */
export const linksInlineKeyboard = (clientUrl) => {
  const url = clientUrl?.trim();
  const isPublicUrl =
    url &&
    /^https?:\/\//.test(url) &&
    !/localhost|127\.0\.0\.1|0\.0\.0\.0/.test(url);

  const rows = [];
  if (isPublicUrl) {
    rows.push([Markup.button.url("🌐 Saytni ochish", url)]);
  }
  rows.push([Markup.button.callback("🔄 Yangilash", "refresh")]);

  return Markup.inlineKeyboard(rows);
};

// Mahsulot uchun inline tugma (callback — URL emas, xavfsiz)
export const productInlineKeyboard = (productId) =>
  Markup.inlineKeyboard([
    [Markup.button.callback("🛒 Buyurtma berish", `order:${productId}`)],
  ]);
