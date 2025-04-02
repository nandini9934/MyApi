// const express = require('express');
// const Meal = require('../models/mealModels');
// const router = express.Router();
// const cors = require('./cors');
// const apiKeyMiddleware = require('./apikeymiddleware');

// router.post('/fooditems', cors, apiKeyMiddleware, async (req, res) => {
//   try {
//     const { name, kcal, p, c, f, image, isVeg, mealType } = req.body;

//     // Create a new food item
//     const newMeal = await Meal.create({ name, kcal, p, c, f, image, isVeg, mealType });
//     res.status(201).json(newMeal); 
//   } catch (err) {
//     res.status(500).json({ message: "An error occurred while saving the food item", error: err.message });
//   }
// });

// router.get('/fooditems', cors, apiKeyMiddleware, async (req, res) => {
//   try {
//     // Fetch all food items
//     const meals = await Meal.findAll();
//     res.json(meals);
//   } catch (err) {
//     res.status(500).json({ message: "An error occurred while fetching the food items", error: err.message });
//   }
// });

// module.exports = router;
