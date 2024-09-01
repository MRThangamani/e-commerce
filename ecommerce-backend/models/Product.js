const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_description: { type: String, required: true },
    product_image: { type: String, required: true },
    originalPrice: { type: Number, required: true },
    discountPrice: { type: Number},
    sellingPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    UOM: { type: String, required: true },
    HSNCode: { type: String, required: true }
});

module.exports = mongoose.model('Product', ProductSchema);