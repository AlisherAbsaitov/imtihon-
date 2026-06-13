/**
 * 404 — topilmagan route'lar uchun.
 */
export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Topilmadi: ${req.originalUrl}`));
};

/**
 * Markaziy error handler. Barcha xatolar shu yerga keladi.
 * Mongoose va boshqa keng tarqalgan xatolarni chiroyli formatga keltiradi.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Server xatosi';

  // Mongoose: noto'g'ri ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resurs topilmadi (noto\'g\'ri ID)';
  }

  // Mongoose: validatsiya xatolari
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Mongoose: duplicate key (masalan email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Bunday ${field} allaqachon mavjud`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
