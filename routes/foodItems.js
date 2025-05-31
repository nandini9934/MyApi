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
router.get("/fooditems", userAuth(), (req, res) => {
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

module.exports = router;
