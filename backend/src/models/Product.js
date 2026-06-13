import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Mahsulot nomi majburiy'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Narx majburiy'],
      min: [0, 'Narx manfiy bo\'lishi mumkin emas'],
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
