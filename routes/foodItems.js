const express = require("express");
const db = require("../sqlconnection");
const router = express.Router();
const { userAuth } = require("../middleware/auth");

/**
 * @swagger
 * /api/fooditems:
 *   get:
 *     summary: Get all food items
 *     tags: [Food Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all food items
 *       500:
 *         description: Database error
 */
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

/**
 * @swagger
 * /api/fooditems/{mealType}:
 *   get:
 *     summary: Get food items by meal type
 *     tags: [Food Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mealType
 *         required: true
 *         schema:
 *           type: string
 *         description: Meal type to filter food items (e.g., breakfast, lunch)
 *     responses:
 *       200:
 *         description: A list of food items for the specified meal type
 *       500:
 *         description: Database error
 */
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
