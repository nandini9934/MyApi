// // routes/getRoutes.js
// const express = require('express');
// const Sale = require('../models/postModels'); // Import your Mongoose model
// const apikey = require("./apikeymiddleware");
// const router = express.Router();
// const cors = require('./cors')
// const apiKeyMiddleware =require('./apikeymiddleware')
// // GET route to fetch data
// router.get('/userinfo',cors,apiKeyMiddleware, async (req, res) => {
//     try {
//         // apikey(req,res);
//         const sales = await Sale.find(); // Fetch all sales from MongoDB
//         res.json(sales); // Send sales as JSON response
//     } catch (err) {
//         res.status(500).json({ message: 'Error fetching sales', error: err });
//     }
// });

// module.exports = router; // Export the router
