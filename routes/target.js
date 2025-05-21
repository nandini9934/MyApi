const express = require("express");
const db = require("../sqlconnection");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

/**
 * POST /api/target
 * Add ONE foodId to the target for a user/date.
 * QUERY: ?date=<date>&foodId=<number>
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
 * GET /api/target/:date
 * List all planned foods (with full data + persisted isConsumed flag).
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
 * DELETE /api/target
 * Remove ONE foodId from the target for a user/date.
 * QUERY: ?date=<date>&foodId=<number>
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
