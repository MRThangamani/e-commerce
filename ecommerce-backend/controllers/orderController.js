const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.placeOrder = async (req, res) => {
  const { address } = req.body;
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    let totalAmount = 0;
    const items = cart.items.map(item => {
      const price = item.productId.sellingPrice;
      totalAmount += price * item.quantity;
      return { productId: item.productId._id, quantity: item.quantity, price };
    });

    const order = new Order({ userId, items, totalAmount, address });
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrderSummary = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
