/**
 * .env dagi ADMIN_TELEGRAM_IDS ro'yxatini massivga aylantiradi.
 * Texnik topshiriq 10-band: bir nechta adminni qo'llab-quvvatlash.
 */
export const getAdminIds = () =>
  (process.env.ADMIN_TELEGRAM_IDS || '')
    .split(',')
    .map((id) => Number(id.trim()))
    .filter(Boolean);

export const isAdmin = (telegramId) => getAdminIds().includes(Number(telegramId));

/**
 * Faqat adminlar uchun guard. Admin bo'lmasa — bloklaydi.
 * Foydalanish: bot.command('admin', adminOnly, handler)
 */
export const adminOnly = (ctx, next) => {
  if (isAdmin(ctx.from?.id)) return next();
  return ctx.reply('⛔️ Bu buyruq faqat adminlar uchun.');
};
