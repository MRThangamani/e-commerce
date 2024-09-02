const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const userId = req.user.id;
  
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

      const totalAmount = cart.items.reduce((total, item) => {
      const price = parseFloat(item.productId.selling_price);
      const quantity = parseInt(item.quantity, 10);
      
      if (isNaN(price) || isNaN(quantity)) {
        throw new Error('Invalid price or quantity in cart');
      }
      return total + (price * quantity);
    }, 0);

    if (isNaN(totalAmount)) {
      throw new Error('Total amount calculation failed');
    }

    const order = new Order({
      userId,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.selling_price
      })),
      shippingAddress,
      paymentMethod,
      totalAmount
    });

    await order.save();
    await Cart.deleteOne({ userId });

    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error); 
    res.status(500).json({ error: error.message });
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
