// const express = require('express');
// const Product = require('../models/productModels');  // Import your Mongoose model
// const apiKeyMiddleware =require('./apikeymiddleware');
// const cors = require('./cors')
// const router = express.Router();

// router.put('/products/:id',cors,apiKeyMiddleware, async (req, res) => {
//     try {
//         const product = await Product.findOne({ _id: req.params.id });
//         if (!product) return res.status(404).json({ message: 'Product not found' });

//         Object.assign(product, req.body);
//         const updatedProduct = await product.save();
//         res.json(updatedProduct);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// module.exports = router; // Export the router