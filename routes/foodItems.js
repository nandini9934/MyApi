const express = require("express");
const db = require("../sqlconnection");
const router = express.Router();
const { userAuth } = require("../middleware/auth");

// GET: Get all food items
router.get("/fooditems", userAuth, (req, res) => {
  const query = `
    SELECT *
    FROM food_items
  `;
  
  db.execute(query, (err, results) => {
    if (err) {
      console.error("Error fetching food items:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// GET: Get food items by meal type
router.get("/fooditems/:mealType", userAuth, (req, res) => {
  const { mealType } = req.params;
  const query = `
    SELECT *
    FROM food_items
    WHERE mealType = ?
  `;
  
  db.execute(query, [mealType], (err, results) => {
    if (err) {
      console.error("Error fetching food items:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

module.exports = router;