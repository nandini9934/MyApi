// // this is the controller for the trackmeal route
// // it handles the CRUD operations for the meals tracked by the user
// // it uses the Meal model to interact with the database
// const express = require("express");
// const Meal = require("../models/trackmealmodels");
// const router = express.Router();
// const apiKeyMiddleware = require("./apikeymiddleware");
// const cors = require("./cors");

// router.use((req, res, next) => {
//   console.log('Incoming request:', {
//     method: req.method,
//     path: req.path,
//     body: req.body,
//     query: req.query
//   });
//   next();
// });

// router.use(express.json()); // Middleware to parse JSON bodies

// router.post("/trackmeal", cors, apiKeyMiddleware, async (req, res) => {
//   try {
//     console.log("Request Body:", JSON.stringify(req.body, null, 2)); // Log full request
    
//     const { id, date, name, kcal, p, c, f, image, isVeg, mealType } = req.body;

//     // Null-check with explicit logging
//     if (!id || !date || !name || !kcal || !p || !c || !f || isVeg === undefined || !mealType) {
//       console.error("Missing required fields:", { id, date, name, kcal, p, c, f, isVeg, mealType });
//       return res.status(400).json({ 
//         error: "Missing required fields",
//         received: { id, date, name, kcal, p, c, f, isVeg, mealType }
//       });
//     }

//     // Replace undefined optional fields with null
//     const sanitizedData = {
//       id,
//       date,
//       name,
//       kcal,
//       p,
//       c,
//       f,
//       image: image || null,
//       isVeg,
//       mealType
//     };

//     // Proceed with creation
//     const newMeal = await Meal.create(sanitizedData);
//     return res.status(201).json(newMeal);
    
//   } catch (err) {
//     console.error("Database Error:", {
//       message: err.message,
//       stack: err.stack,
//       body: req.body
//     });
//     res.status(500).json({ 
//       error: "Database operation failed",
//       details: err.message 
//     });
//   }
// });

// router.delete("/trackmeal", cors, apiKeyMiddleware, async (req, res) => {
//   try {
//     const { id, date, name } = req.body;

//     // Delete a specific meal entry
//     const result = await Meal.destroy({ where: { id, date, name } });

//     if (result === 0) {
//       return res.status(404).json({ message: "Meal not found" });
//     }

//     res.status(200).json({ message: "Meal deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "An error occurred while deleting the meal", error: err.message });
//   }
// });

// router.put("/trackmeal", cors, apiKeyMiddleware, async (req, res) => {
//   try {
//     const { id, date, name, updatedMeal } = req.body;

//     if (!id || !date || !name || !updatedMeal) {
//       return res.status(400).json({ 
//         error: "Missing required fields",
//         received: { id, date, name, updatedMeal }
//       });
//     }

//     // Replace undefined optional fields in updatedMeal with null
//     const sanitizedUpdatedMeal = {
//       ...updatedMeal,
//       image: updatedMeal.image || null
//     };

//     // Update a specific meal entry
//     const result = await Meal.update(sanitizedUpdatedMeal, { where: { id, date, name } });

//     if (result[0] === 0) {
//       return res.status(404).json({ message: "Meal not found" });
//     }

//     res.status(200).json({ message: "Meal updated successfully" });
//   } catch (err) {
//     console.error("Error during update:", {
//       message: err.message,
//       stack: err.stack,
//       body: req.body
//     });
//     res.status(500).json({ message: "An error occurred while updating the meal", error: err.message });
//   }
// });

// router.get("/trackmeal", cors, apiKeyMiddleware, async (req, res) => {
//   try {
//     const { id, date } = req.query;

//     // More explicit validation
//     if (!id || !date) {
//       console.error("Missing query parameters:", { id, date });
//       return res.status(400).json({
//         message: "Both id and date query parameters are required",
//         received: {
//           id: typeof id,
//           date: typeof date
//         }
//       });
//     }

//     const meals = await Meal.findAll({ where: { id, date } });
//     res.json(meals || []);
//   } catch (err) {
//     console.error("Error during fetch:", {
//       message: err.message,
//       stack: err.stack,
//       query: req.query
//     });
//     res.status(500).json({ 
//       message: "Error fetching meals",
//       error: err.message,
//       queryParams: req.query
//     });
//   }
// });

// module.exports = router;
