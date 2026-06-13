import { Product } from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @route   GET /api/products
 * @desc    Mahsulotlar ro'yxati (qidiruv + paginatsiya)
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 12);
  const search = req.query.search?.trim();

  const filter = search
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

/**
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Mahsulot topilmadi');
  }
  res.json({ success: true, product });
});

/**
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, image } = req.body;
  const product = await Product.create({ name, description, price, stock, image });
  res.status(201).json({ success: true, product });
});

/**
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Mahsulot topilmadi');
  }
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json({ success: true, product: updated });
});

/**
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Mahsulot topilmadi');
  }
  await product.deleteOne();
  res.json({ success: true, message: 'Mahsulot o\'chirildi' });
});
