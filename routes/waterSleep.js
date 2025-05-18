const express = require("express");
const db = require("../sqlconnection");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

/**
 * GET /api/water-sleep/:date
 * Get the user's water and sleep data for a specific date
 */
router.get("/water-sleep/:date", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;
  const { date } = req.params;
  const query = "SELECT glasses_of_water, hours_of_sleep FROM water_sleep WHERE userId = ? AND date = ?";
  db.execute(query, [userId, date], (err, results) => {
    if (err) {
      console.error("Error fetching water/sleep data:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      // Return empty object if no data found
      return res.json({});
    }
    res.json(results[0]);
  });
});

/**
 * POST /api/water-sleep/:date/water
 * Add or update glasses of water for a specific date
 * Body: { "glasses_of_water": 5 }
 */
router.post("/water/:date", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;
  const { date } = req.params;
  let { glasses_of_water } = req.body;
  glasses_of_water = typeof glasses_of_water === "undefined" ? 0 : glasses_of_water;

  // Try to insert, or update if exists
  const query = `
    INSERT INTO water_sleep (userId, date, glasses_of_water, hours_of_sleep)
    VALUES (?, ?, ?, 0)
    ON DUPLICATE KEY UPDATE glasses_of_water = VALUES(glasses_of_water)
  `;
  db.execute(query, [userId, date, glasses_of_water], (err) => {
    if (err) {
      console.error("Error inserting/updating water:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ userId, date, glasses_of_water });
  });
});

/**
 * POST /api/water-sleep/:date/sleep
 * Add or update hours of sleep for a specific date
 * Body: { "hours_of_sleep": 7 }
 */
router.post("/sleep/:date", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;
  const { date } = req.params;
  let { hours_of_sleep } = req.body;
  hours_of_sleep = typeof hours_of_sleep === "undefined" ? 0 : hours_of_sleep;

  // Try to insert, or update if exists
  const query = `
    INSERT INTO water_sleep (userId, date, glasses_of_water, hours_of_sleep)
    VALUES (?, ?, 0, ?)
    ON DUPLICATE KEY UPDATE hours_of_sleep = VALUES(hours_of_sleep)
  `;
  db.execute(query, [userId, date, hours_of_sleep], (err) => {
    if (err) {
      console.error("Error inserting/updating sleep:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ userId, date, hours_of_sleep });
  });
});

module.exports = router;