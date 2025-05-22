const express = require("express");
const db = require("../sqlconnection");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Water & Sleep Tracking
 *     description: Daily water intake and sleep duration tracking
 */

/**
 * GET /api/water-sleep/:date
 * Get the user's water and sleep data for a specific date
 */

/**
 * @swagger
 * api/water-sleep/{date}:
 *   get:
 *     tags: [Water & Sleep Tracking]
 *     summary: Get daily water and sleep data
 *     description: Retrieve water and sleep records for a specific date
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-10-05"
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Water and sleep data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WaterSleepData'
 *       404:
 *         description: No data found (returns empty object)
 *       500:
 *         description: Database error
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

/**
 * @swagger
 * api/water/{date}:
 *   post:
 *     tags: [Water & Sleep Tracking]
 *     summary: Update water intake
 *     description: Add/update daily water intake (creates record if none exists)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-10-05"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WaterUpdate'
 *     responses:
 *       201:
 *         description: Water intake updated/created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WaterSleepResponse'
 *       500:
 *         description: Database error
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

/**
 * @swagger
 * api/sleep/{date}:
 *   post:
 *     tags: [Water & Sleep Tracking]
 *     summary: Update sleep duration
 *     description: Add/update daily sleep hours (creates record if none exists)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2023-10-05"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SleepUpdate'
 *     responses:
 *       201:
 *         description: Sleep data updated/created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WaterSleepResponse'
 *       500:
 *         description: Database error
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


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     WaterSleepData:
 *       type: object
 *       properties:
 *         glasses_of_water:
 *           type: integer
 *           minimum: 0
 *           example: 5
 *         hours_of_sleep:
 *           type: number
 *           minimum: 0
 *           example: 7.5
 *     WaterUpdate:
 *       type: object
 *       required:
 *         - glasses_of_water
 *       properties:
 *         glasses_of_water:
 *           type: integer
 *           minimum: 0
 *           example: 8
 *     SleepUpdate:
 *       type: object
 *       required:
 *         - hours_of_sleep
 *       properties:
 *         hours_of_sleep:
 *           type: number
 *           minimum: 0
 *           example: 7.5
 *     WaterSleepResponse:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *         date:
 *           type: string
 *           format: date
 *         glasses_of_water:
 *           type: integer
 *         hours_of_sleep:
 *           type: number
 */

module.exports = router;