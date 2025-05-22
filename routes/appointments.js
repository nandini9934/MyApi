const express = require("express");
const db = require("../sqlconnection");
const { userAuth } = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

/**
 * @swagger
 * api/appointments/user:
 *   get:
 *     summary: Get upcoming appointments for the logged-in user
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of upcoming appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Database error
 */
router.get("/appointments/user", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;

  const query = `
    SELECT id, userId, expertId, date, timeSlot, topic, status, callId, createdAt, updatedAt
    FROM appointments
    WHERE userId = ?
      AND (
            date > CURDATE()
         OR (date = CURDATE()
             AND STR_TO_DATE(timeSlot, '%h:%i %p') > CURTIME()
            )
          )
    ORDER BY date ASC,
             STR_TO_DATE(timeSlot, '%h:%i %p') ASC
  `;
  db.execute(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

/**
 * @swagger
 * api/appointments/available-slots/{date}:
 *   get:
 *     summary: Get available appointment time slots for a given date
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Available time slots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Database error
 */
router.get("/appointments/available-slots/:date", userAuth, (req, res) => {
  const { date } = req.params;
  const allSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"];

  let candidates = allSlots;
  const today = new Date().toISOString().slice(0, 10);
  if (date === today) {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    candidates = allSlots.filter(slot => {
      const [time, meridiem] = slot.split(" ");
      let [h, m] = time.split(":").map(Number);
      if (meridiem === "PM" && h !== 12) h += 12;
      if (meridiem === "AM" && h === 12) h = 0;
      const slotMinutes = h * 60 + m;
      return slotMinutes > nowMinutes;
    });
  }

  const query = "SELECT timeSlot FROM appointments WHERE date = ?";
  db.execute(query, [date], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const booked = results.map(r => r.timeSlot);
    const available = candidates.filter(slot => !booked.includes(slot));
    res.json(available);
  });
});

/**
 * @swagger
 * api/appointments:
 *   post:
 *     summary: Book a new appointment
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - timeSlot
 *               - topic
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               timeSlot:
 *                 type: string
 *               topic:
 *                 type: string
 *               status:
 *                 type: string
 *               expertId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Database error
 */
router.post("/appointments", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;
  const { date, timeSlot, topic, status } = req.body;
  const expertId = req.body.expertId || null;
  const id = "app_" + uuidv4();
  const callId = uuidv4();
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const query = `
    INSERT INTO appointments (id, userId, expertId, date, timeSlot, topic, status, callId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.execute(
    query,
    [id, userId, expertId, date, timeSlot, topic, status || "scheduled", callId, now, now],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.status(201).json({ id, userId, expertId, date, timeSlot, topic, status: status || "scheduled", callId, createdAt: now, updatedAt: now });
    }
  );
});

/**
 * @swagger
 * api/appointments/{appointmentId}/cancel:
 *   put:
 *     summary: Cancel an appointment
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the appointment to cancel
 *     responses:
 *       200:
 *         description: Appointment cancelled
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Database error
 */
router.put("/appointments/:appointmentId/cancel", userAuth, (req, res) => {
  const { appointmentId } = req.params;
  const query = "UPDATE appointments SET status = 'cancelled', updatedAt = ? WHERE id = ?";
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  db.execute(query, [now, appointmentId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Appointment not found" });
    res.json({ id: appointmentId, status: "cancelled" });
  });
});

module.exports = router;
