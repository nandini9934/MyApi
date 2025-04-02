// const express = require('express');
// const Sale = require('../models/postModels'); // Import your Mongoose model
// const apiKeyMiddleware =require('./apikeymiddleware');
// const cors = require('./cors')
// const router = express.Router();

// router.delete("/userinfo/:email",cors,apiKeyMiddleware, async (req, res) => {
//     let email =req.params.email;

//     try {
//         const sale = await Sale.deleteOne({ email: email });
        
//         if (sale.modifiedCount > 0) {
//             res.status(200).json({ object: sale, message: "Document successfully deleted" })
//         }
//         else {
//             res.status(200).json({ object: sale, message: "No document found" })
//         }
//     }
//     catch {
//         res.status(500).json("internal server error");
//     }
// })

// module.exports = router; // Export the router