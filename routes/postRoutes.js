// // routes/postRoutes.js
// const express = require('express');
// const Sale = require('../models/postModels'); // Import your Mongoose model
// const apiKeyMiddleware =require('./apikeymiddleware')
// const router = express.Router();
// const apikey = require("./apikeymiddleware");
// const cors = require('./cors')

// // POST route to add new data
// router.post('/setsales',cors, apiKeyMiddleware, async (req, res) => {
//     // apikey(req,res);
//     const newSale = new Sale({
//         gender: req.body.gender,
//         dob: req.body.dob,
//         height: req.body.height,
//         weight: req.body.weight,
//         medical: req.body.medical,
//         goal: req.body.goal,
//         bodyfat: req.body.bodyfat,
//         workout: req.body.workout,
//         food: req.body.food,
//         occupation: req.body.occupation
//     });

//     try {
//         const savedSale = await newSale.save(); // Save new sale to MongoDB
        
//         res.status(201).json({message : "Thankyou! Your data has been successfully saved.", object : savedSale}); // Send saved sale as a response
//     } catch (err) {
//         res.status(500).json({ message: 'Error creating sale', error: err });
//     }
// });

// module.exports = router; // Export the router