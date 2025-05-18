const express = require("express");
const db = require("../sqlconnection");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

// POST: Assign food items to a user for a date
router.post("/target/:date", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;
  const { date } = req.params;
  const { food_items } = req.body; // food_items should be an array

  if (!date || !food_items) {
    return res.status(400).json({ error: "date and food_items are required" });
  }

  const query = "INSERT INTO target (userId, date, food_items) VALUES (?, ?, ?)";
  db.execute(query, [userId, date, JSON.stringify(food_items)], (err, result) => {
    if (err) {
      console.error("Error inserting target:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Target assigned successfully", id: result.insertId });
  });
});


// GET: Get target for a user for a date
router.get("/target/:date", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;
  const { date } = req.params;

  if (!date) {
    return res.status(400).json({ error: "date is required" });
  }

  const query = "SELECT * FROM target WHERE userId = ? AND date = ?";
  db.execute(query, [userId, date], (err, results) => {
    if (err) {
      console.error("Error fetching target:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      // Return an empty list if no target is found
      return res.json([]);
    }
    // Parse JSON and return only the food_items array
    const foodItems = JSON.parse(results[0].food_items);
    res.json(foodItems);
  });
});

// PATCH: Update isSelected for a food item in the target for a date
router.patch("/target/:date/select", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;
  const { date } = req.params;
  const { foodName, mealType } = req.body; // Identify the food item

  if (!date || !foodName || !mealType) {
    return res.status(400).json({ error: "date, foodName, and mealType are required" });
  }

  const selectQuery = "SELECT * FROM target WHERE userId = ? AND date = ?";
  db.execute(selectQuery, [userId, date], (err, results) => {
    if (err) {
      console.error("Error fetching target:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No target found for this date" });
    }

    let food_items = JSON.parse(results[0].food_items);
    let updated = false;

    food_items = food_items.map(item => {
      if (item.name === foodName && item.mealType === mealType) {
        item.isSelected = true;
        updated = true;
      }
      return item;
    });

    if (!updated) {
      return res.status(404).json({ message: "Food item not found in target" });
    }

    const updateQuery = "UPDATE target SET food_items = ? WHERE userId = ? AND date = ?";
    db.execute(updateQuery, [JSON.stringify(food_items), userId, date], (err2) => {
      if (err2) {
        console.error("Error updating target:", err2);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Food item marked as selected", food_items });
    });
  });
});

module.exports = router;