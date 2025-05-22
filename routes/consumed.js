const express = require("express");
const db = require("../sqlconnection");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Consumed
 *     description: Food consumption tracking operations
 * 
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     FoodItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 123
 *         name:
 *           type: string
 *           example: "Grilled Chicken"
 *         kcal:
 *           type: number
 *           example: 250
 *         p:
 *           type: number
 *           example: 30
 *         c:
 *           type: number
 *           example: 0
 *         f:
 *           type: number
 *           example: 12
 *         image:
 *           type: string
 *           example: "chicken.jpg"
 *         isVeg:
 *           type: boolean
 *           example: false
 *         mealType:
 *           type: string
 *           example: "lunch"
 *         recipe:
 *           type: string
 *           example: "Grill for 8 minutes each side"
 */

/**
 * @swagger
 * /api/consumed:
 *   post:
 *     summary: Mark a food item as consumed and update the target flag
 *     tags: [Consumed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-10-15"
 *         description: Date of consumption in YYYY-MM-DD format
 *       - in: query
 *         name: foodId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the food item
 *     responses:
 *       200:
 *         description: Successfully marked as consumed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Marked as consumed"
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Database error
 */
router.post("/consumed", userAuth, (req, res) => {
  // Existing code unchanged
  const userId = req.userInfo.user.id;
  const { date, foodId } = req.query;

  if (!date || !foodId) {
    return res.status(400).json({ error: "date and foodId are required" });
  }

  const insert = `
    INSERT INTO consumed_food (userId, date, foodId)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE createdAt = CURRENT_TIMESTAMP
  `;

  db.execute(insert, [userId, date, foodId], (err) => {
    if (err) return res.status(500).json({ error: "Database error" });

    const upd = `
      UPDATE target
         SET isConsumed = 1
       WHERE userId = ? AND date = ? AND foodId = ?
    `;
    db.execute(upd, [userId, date, foodId], (err2) => {
      if (err2) console.error("Warning: failed to update target flag", err2);
    });

    res.status(200).json({ message: "Marked as consumed" });
  });
});

/**
 * @swagger
 * /api/consumed/{date}:
 *   get:
 *     summary: Retrieve consumed foods for a specific date
 *     tags: [Consumed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-10-15"
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: List of consumed food items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FoodItem'
 *       400:
 *         description: Missing date parameter
 *       500:
 *         description: Database error
 */
router.get("/consumed/:date", userAuth, (req, res) => {
  // Existing code unchanged
  const userId = req.userInfo.user.id;
  const { date } = req.params;

  if (!date) {
    return res.status(400).json({ error: "date is required" });
  }

  const query = `
    SELECT
      cf.foodId AS id,
      f.name,
      f.kcal,
      f.p, f.c, f.f,
      f.image,
      f.isVeg,
      f.mealType,
      f.recipe
    FROM consumed_food AS cf
    JOIN food_items AS f
      ON cf.foodId = f.id
    WHERE cf.userId = ?
      AND cf.date = ?
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
 * /api/consumed:
 *   delete:
 *     summary: Unmark a food item as consumed and update the target flag
 *     tags: [Consumed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-10-15"
 *         description: Date of consumption in YYYY-MM-DD format
 *       - in: query
 *         name: foodId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the food item
 *     responses:
 *       200:
 *         description: Successfully unmarked as consumed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unmarked as consumed"
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: No consumption record found
 *       500:
 *         description: Database error
 */
router.delete("/consumed", userAuth, (req, res) => {
  // Existing code unchanged
  const userId = req.userInfo.user.id;
  const { date, foodId } = req.query;

  if (!date || !foodId) {
    return res.status(400).json({ error: "date and foodId are required" });
  }

  const del = `
    DELETE FROM consumed_food
     WHERE userId = ? AND date = ? AND foodId = ?
  `;
  db.execute(del, [userId, date, foodId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Not marked consumed" });
    }

    const upd = `
      UPDATE target
         SET isConsumed = 0
       WHERE userId = ? AND date = ? AND foodId = ?
    `;
    db.execute(upd, [userId, date, foodId], (err2) => {
      if (err2) console.error("Warning: failed to update target flag", err2);
    });

    res.json({ message: "Unmarked as consumed" });
  });
});

module.exports = router;