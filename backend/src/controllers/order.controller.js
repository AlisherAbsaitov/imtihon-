import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notifyAdmins } from '../bot/index.js';

/**
 * @route   POST /api/orders
 * @desc    Yangi buyurtma yaratish
 * @access  Private
 * @body    { items: [{ product: id, qty: n }] }
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Buyurtmada kamida 1 ta mahsulot bo\'lsin');
  }

  // Narxni clientga ishonmasdan DB'dan olamiz (xavfsizlik)
  const detailedItems = [];
  let total = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Mahsulot topilmadi: ${item.product}`);
    }
    const qty = Math.max(1, Number(item.qty) || 1);
    if (product.stock < qty) {
      res.status(400);
      throw new Error(`"${product.name}" uchun yetarli zaxira yo'q`);
    }
    detailedItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      qty,
    });
    total += product.price * qty;
    // Zaxirani kamaytiramiz
    product.stock -= qty;
    await product.save();
  }

  const order = await Order.create({
    user: req.user._id,
    items: detailedItems,
    total,
  });

  // Texnik topshiriq 8-band: buyurtma berilganda botga xabar
  notifyAdmins(
    `🛒 *Yangi buyurtma*\nMijoz: ${req.user.name}\nSumma: ${total.toLocaleString()} so'm\nMahsulotlar: ${detailedItems.length} ta`
  );

  res.status(201).json({ success: true, order });
});

/**
 * @route   GET /api/orders/my
 * @desc    O'z buyurtmalarim
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, orders });
});

/**
 * @route   GET /api/orders
 * @desc    Barcha buyurtmalar (admin)
 * @access  Private/Admin
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, orders });
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Buyurtma statusini o'zgartirish (admin)
 * @access  Private/Admin
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Buyurtma topilmadi');
  }
  order.status = status;
  await order.save();
  res.json({ success: true, order });
});
