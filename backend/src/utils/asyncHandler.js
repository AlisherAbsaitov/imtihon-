/**
 * Har bir async controller'ni try/catch bilan o'rashdan qutqaradi.
 * Xatolarni avtomatik ravishda error middleware'ga uzatadi.
 *
 * Foydalanish:
 *   export const getX = asyncHandler(async (req, res) => { ... });
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
