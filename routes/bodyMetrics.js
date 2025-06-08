const express = require("express");
const db = require("../sqlconnection");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * /api/body-metrics:
 *   post:
 *     summary: Add body metrics for a date
 *     tags: [BodyMetrics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bodyfat, water, muscle, weight, bonemass]
 *             properties:
 *               bodyfat: { type: number }
 *               water: { type: number }
 *               muscle: { type: number }
 *               weight: { type: number }
 *               bonemass: { type: number }
 *   get:
 *     summary: Get body metrics for a date
 *     tags: [BodyMetrics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Body metrics for the date
 *   delete:
 *     summary: Delete body metrics for a date
 *     tags: [BodyMetrics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Deleted successfully
 */

// CREATE (date payload me)
router.post("/body-metrics", userAuth(), (req, res) => {
  const userId = req.userInfo.id;
  let { bodyfat, water, muscle, weight, bonemass, date } = req.body;

  if (!date || bodyfat == null || water == null || muscle == null || weight == null || bonemass == null) {
    return res.status(400).json({ error: "date, bodyfat, water, muscle, weight, bonemass are required" });
  }

  // Normalize date to yyyy-mm-dd string
  const parsed = new Date(date);
  if (isNaN(parsed)) {
    return res.status(400).json({ error: "Invalid date format" });
  }
  const yyyy = parsed.getFullYear();
  const mm = String(parsed.getMonth() + 1).padStart(2, '0');
  const dd = String(parsed.getDate()).padStart(2, '0');
  date = `${yyyy}-${mm}-${dd}`;

  const query = `
    INSERT INTO body_metrics (userId, bodyfat, water, muscle, weight, bonemass, date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE bodyfat=VALUES(bodyfat), water=VALUES(water), muscle=VALUES(muscle), weight=VALUES(weight), bonemass=VALUES(bonemass)
  `;
  db.execute(query, [userId, bodyfat, water, muscle, weight, bonemass, date], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Body metrics saved for date", date });
  });
});

router.get("/body-metrics", userAuth(), (req, res) => {
  const userId = req.userInfo.id;
  if (!userId) {
    return res.status(400).json({ error: "userId required" });
  }
  const query = "SELECT * FROM body_metrics WHERE userId = ? ORDER BY date DESC";
  db.execute(query, [userId], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// DELETE (by id only)
router.delete("/body-metrics", userAuth(), (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "id required" });
  }
  const query = "DELETE FROM body_metrics WHERE id = ?";
  db.execute(query, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Entry not found for this id" });
    }
    res.json({ message: "Deleted successfully", id });
  });
});

module.exports = router;