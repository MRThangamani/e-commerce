const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: Number},
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  },
    paymentMethod: { type: String, default: 'cash' },
  createdAt: { type: Date, default: Date.now },
  estimatedDeliveryDate: Date,
  orderNumber: { type: String, unique: true }

});

module.exports = mongoose.model('Order', OrderSchema);