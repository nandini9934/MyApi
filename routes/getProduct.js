// const express = require("express");
// const router = express.Router();
// const Product = require("../models/productModels");
// const cors = require("./cors");
// const apiKeyMiddleware = require("./apikeymiddleware");

// /**
//  * @swagger
//  * /products:
//  *   get:
//  *     summary: Get all products
//  *     description: Retrieve a list of all products from the database.
//  *     tags:
//  *       - Products
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved list of products.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: string
//  *                     example: "63f0e92e1234567890abcdef"
//  *                   name:
//  *                     type: string
//  *                     example: "Product Name"
//  *                   price:
//  *                     type: number
//  *                     example: 19.99
//  *                   description:
//  *                     type: string
//  *                     example: "A detailed description of the product."
//  *       500:
//  *         description: Server error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Internal server error"
//  */
// // GET all products
// router.get("/products", cors, apiKeyMiddleware, async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
