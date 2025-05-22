const express = require("express");
const db = require("../sqlconnection");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * /api/target:
 *   post:
 *     summary: Add a food item to the user's target for a given date
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date for which the food is being added
 *       - in: query
 *         name: foodId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the food item
 *     responses:
 *       201:
 *         description: Food item added to target
 *       400:
 *         description: Missing date or foodId
 *       409:
 *         description: Already in target
 *       500:
 *         description: Database error
 */
router.post("/target", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;
  const { date, foodId } = req.query;

  if (!date || !foodId) {
    return res.status(400).json({ error: "date and foodId are required" });
  }

  const insert = `
    INSERT INTO target (userId, date, foodId, isConsumed)
    VALUES (?, ?, ?, 0)
  `;
  db.execute(insert, [userId, date, foodId], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Already in target" });
      }
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Added to target", id: result.insertId });
  });
});

/**
 * @swagger
 * /api/target/{date}:
 *   get:
 *     summary: Get all planned food items for a given date
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date to retrieve the food plan for
 *     responses:
 *       200:
 *         description: List of food items with target status
 *       500:
 *         description: Database error
 */
router.get("/target/:date", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;
  const { date } = req.params;

  if (!date) return res.status(400).json({ error: "date is required" });

  const query = `
    SELECT
      t.foodId       AS id,
      f.name,
      f.kcal,
      f.p, f.c, f.f,
      f.image,
      f.isVeg,
      f.mealType,
      f.recipe,
      t.isConsumed
    FROM target AS t
    JOIN food_items AS f
      ON f.id = t.foodId
    WHERE t.userId = ?
      AND t.date   = ?
    ORDER BY f.mealType, f.name
  `;
  db.execute(query, [userId, date], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

/**
 * @swagger
 * /api/target:
 *   delete:
 *     summary: Remove a food item from the user's target for a given date
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date from which the food item is to be removed
 *       - in: query
 *         name: foodId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the food item to remove
 *     responses:
 *       200:
 *         description: Successfully removed from target
 *       400:
 *         description: Missing date or foodId
 *       404:
 *         description: Not found in target
 *       500:
 *         description: Database error
 */
router.delete("/target", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;
  const { date, foodId } = req.query;

  if (!date || !foodId) {
    return res.status(400).json({ error: "date and foodId are required" });
  }

  const del = `
    DELETE FROM target
     WHERE userId = ?
       AND date   = ?
       AND foodId = ?
  `;
  db.execute(del, [userId, date, foodId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Not in target" });
    }
    res.json({ message: "Removed from target", foodId });
  });
});

module.exports = router;
