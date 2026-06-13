import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Umumiy statistikani hisoblaydigan yordamchi funksiya.
 * Ham API (admin dashboard) ham Telegram bot (/stats) shuni ishlatadi.
 */
export const getStatsData = async () => {
  const [users, products, orders, revenueAgg] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
  ]);

  return {
    users,
    products,
    orders,
    revenue: revenueAgg[0]?.total || 0,
  };
};

/**
 * @route   GET /api/stats
 * @access  Private/Admin
 */
export const getStats = asyncHandler(async (req, res) => {
  const stats = await getStatsData();
  res.json({ success: true, stats });
});
