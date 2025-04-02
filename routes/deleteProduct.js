// const express = require('express');
// const Product = require('../models/productModels'); // Import your Mongoose model
// const apiKeyMiddleware =require('./apikeymiddleware');
// const cors = require('./cors')
// const router = express.Router();

// router.delete('/products/:id',cors,apiKeyMiddleware, async (req, res) => {
//     try {
//         const product = await Product.findOneAndDelete({ _id: req.params.id });
//         if (!product) return res.status(404).json({ message: 'Product not found' });

//         res.json({ message: 'Product deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// module.exports = router;

// module.exports = router; // Export the router