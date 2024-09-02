const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose'); // Ensure mongoose is required

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  console.log(productId)
  // if (!mongoose.Types.ObjectId.isValid(productId)) {
  //   return res.status(400).json({ error: 'Invalid productId' });
  // }

  try {
    // Convert productId to ObjectId
    const productObjectId = productId;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Find index of the item in the cart
    const itemIndex = cart.items.findIndex(item => item.productId.equals(productObjectId));

    if (itemIndex > -1) {
      // Item exists, update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Item does not exist, add new item
      cart.items.push({ productId: productObjectId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update quantity
exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.productId == productId);
    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    } else {
      if (quantity > 0) {
        cart.items.push({ productId, quantity });
      }
    }
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(item => !item.productId == productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};