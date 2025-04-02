// const express = require('express');
// const Product = require('../models/productModels'); 
// const router = express.Router();

// router.post('/products', async (req, res) => {
//     const product = new Product({
//         image: req.body.image,
//         name: req.body.name,
//         originalPrice: req.body.originalPrice,
//         discountedPrice: req.body.discountedPrice,
//         discount: req.body.discount,
//         rating: req.body.rating,
//         delivery: req.body.delivery,
//         description: req.body.description
//     });

//     try {
//         const newProduct = await product.save();
//         res.status(201).json(newProduct);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// module.exports = router;
