// const express = require('express');
// const Sale = require('../models/postModels'); // Import your Mongoose model
// const apiKeyMiddleware =require('./apikeymiddleware');
// const cors = require('./cors')
// const router = express.Router();

// router.put("/userinfo/:email",cors,apiKeyMiddleware,async (req, res) => {
//    let updatedBody = req.body;
//    let email =req.params.email;

//     try{
//         const sale = await Sale.updateOne({ email: email }, { $set:updatedBody})
//         if(sale.modifiedCount > 0)
//         {
//       res.status(200).json({object: sale,message: "succesfull updation"})
//         }
//         else{
//             res.status(200).json({object: sale,message: "No updation has done"})  
//         }
//     }
//     catch{
//       res.status(500).json("internal server error");
//     }
// })

// module.exports = router; // Export the router