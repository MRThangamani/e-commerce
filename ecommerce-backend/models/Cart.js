const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  items: [
    {
      productId: { type: Number},
      quantity: { type: Number, required: true }
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
