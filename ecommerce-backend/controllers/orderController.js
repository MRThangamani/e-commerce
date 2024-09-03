const Order = require('../models/Order');
const path = require('path');
const fs = require('fs');

exports.createOrder = async (req, res) => {
  const { products, shippingAddress, paymentMethod } = req.body;
  if (paymentMethod !== 'Cash') {
    return res.status(400).json({ success: false, message: 'Invalid payment method.' });
  }

  const productsFilePath = path.join(__dirname, 'data', 'product.json');
  let productDocuments;
  try {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    productDocuments = JSON.parse(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error reading product data' });
  }

  const productSet = new Set(products);

  const filteredProducts = productDocuments.filter(product => productSet.has(product.id));
  if (filteredProducts.length === 0) {
    return res.status(400).json({ success: false, message: 'No products found.' });
  }

  let totalAmount = 0;
  const items = [];
  try {
    for (const product of filteredProducts) {
      const productDetails = products.find(p => p.productId === product.id);
      if (!productDetails) continue;

      const price = Number(product.selling_price);
      if (isNaN(price)) {
        throw new Error(`Invalid price for product ${product.id}`);
      }

      const quantity = productDetails.quantity;
      const itemTotal = price * quantity;

      items.push({
        productId: product.id,
        quantity,
        price
      });

      totalAmount += itemTotal;
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Error calculating total amount', error: error.message });
  }

  // Create new order
  const order = new Order({
    userId: req.user.id, // Ensure req.user.id is set correctly
    items,
    totalAmount,
    shippingAddress,
    paymentMethod
  });

  try {
    await order.save();
    res.status(201).json({ success: true, order: order, message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error placing order', error: error.message });
  }
};


exports.getOrderSummary = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('items.productId');
    res.status(200).json({success:true,order:orders,message:"Order List"});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
