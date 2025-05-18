const express = require("express");
const db = require("../sqlconnection");
const { userAuth } = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

const formatDate = (dateObj) => {
  if (!dateObj) return null;
  // If it's already a string (as returned by MySQL), just return it
  if (typeof dateObj === "string") return dateObj;
  // Fallback for Date objects
  return dateObj.toISOString().slice(0, 10);
};

// GET /api/appointments/user
router.get("/appointments/user", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;
  const now = new Date();
  const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

  const query = `
    SELECT id, userId, expertId, date, timeSlot, topic, status, callId, createdAt, updatedAt
    FROM appointments
    WHERE userId = ?
      AND (
        date > ?
        OR (date = ? AND (
          -- Only include future time slots for today
          STR_TO_DATE(timeSlot, '%h:%i %p') > STR_TO_DATE(?, '%H:%i')
        ))
      )
    ORDER BY date ASC, timeSlot ASC
  `;
  db.execute(query, [userId, today, today, currentTime], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const formatted = results.map(row => ({
      ...row,
      date: row.date,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
    res.json(formatted);
  });
});

// GET /api/appointments/available-slots/:date
router.get("/appointments/available-slots/:date", userAuth, (req, res) => {
  const { date } = req.params;
  // Example: 9am, 10am, 11am, 2pm, 3pm
  const allSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"];
  const query = "SELECT timeSlot FROM appointments WHERE date = ?";
  db.execute(query, [date], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const booked = results.map(r => r.timeSlot);
    const available = allSlots.filter(slot => !booked.includes(slot));
    res.json(available);
  });
});

// POST /api/appointments
router.post("/appointments", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;
  const { date, timeSlot, topic, status } = req.body;
  const expertId = req.body.expertId || null; // You may want to assign this based on your logic
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

// PUT /api/appointments/:appointmentId/cancel
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