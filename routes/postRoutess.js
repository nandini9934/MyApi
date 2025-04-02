// // routes/postRoutes.js
// const express = require("express"); // Import your Mongoose model
// const apiKeyMiddleware = require("./apikeymiddleware");
// const router = express.Router();
// const validateUser = require("../sqlconnection");
// const cors = require("./cors");

// // POST route to add new data
// router.post(
//   "/validatecredentials",
//   cors,
//   apiKeyMiddleware,
//   async (req, res) => {
//     // apikey(req,res);
//     const email = req.body.email;
//     const password = req.body.password;
//     try {
//       validateUser(email, password); // Save new sale to MongoDB
//       res
//         .status(201)
//         .json({
//           message: "Thankyou! Your data has been successfully saved.",
//           object: savedSale,
//         }); // Send saved sale as a response
//     } catch (err) {
//       res.status(500).json({ message: "Error creating sale", error: err });
//     }
//   }
// );

// module.exports = router; // Export the router
