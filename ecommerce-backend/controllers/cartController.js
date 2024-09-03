const Cart = require('../models/Cart');
const path = require('path');
const fs = require('fs');

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;
  try {
    const productObjectId = productId;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    const itemIndex = cart.items.findIndex(item => item.productId == productObjectId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId: productObjectId, quantity });
    }

    await cart.save();
    res.status(200).json({success:true,cart:cart,message:"Item added to cart"});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const productsFilePath = path.join(__dirname, 'data', 'product.json');
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

    const cart = await Cart.findOne({ userId: req.user.id });
    const productMap = products.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});

    const cartItemsWithDetails = cart.items.map(item => {
      const product = productMap[item.productId];
      if (product) {
        return {
          productId: product.id,
          name: product.name,
          quantity: item.quantity,
          price: product.selling_price,
          image: product.image
        };
      }
      return null;
    }).filter(item => item !== null);
    res.status(200).json({success:true,cart:cart,product: cartItemsWithDetails,message:"cart list"});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;
  try {
    const productsFilePath = path.join(__dirname, 'data', 'product.json');
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

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
    const productMap = products.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});

    const cartItemsWithDetails = cart.items.map(item => {
      const product = productMap[item.productId];
      if (product) {
        return {
          productId: product.id,
          name: product.name,
          quantity: item.quantity,
          price: product.selling_price,
          image: product.image
        };
      }
      return null;
    }).filter(item => item !== null);
    res.status(200).json({success:true,cart:cart,product: cartItemsWithDetails,message:"Update Cart Successfully"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeCartItem = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;
  try {
    const productsFilePath = path.join(__dirname, 'data', 'product.json');
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
    
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(item => !item.productId == productId);
    await cart.save();
    const productMap = products.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});

    const cartItemsWithDetails = cart.items.map(item => {
      const product = productMap[item.productId];
      if (product) {
        return {
          productId: product.id,
          name: product.name,
          quantity: item.quantity,
          price: product.selling_price,
          image: product.image
        };
      }
      return null;
    }).filter(item => item !== null);
    res.status(200).json({success:true,cart:cart,product: cartItemsWithDetails,message:"Remove Cart Successfully"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};