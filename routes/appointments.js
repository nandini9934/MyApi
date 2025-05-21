const express = require("express");
const db = require("../sqlconnection");
const { userAuth } = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

// GET /api/appointments/user
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


// GET /api/appointments/available-slots/:date
router.get("/appointments/available-slots/:date", userAuth, (req, res) => {
  const { date } = req.params;
  const allSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"];

  // figure out which slots we even consider
  let candidates = allSlots;
  const today = new Date().toISOString().slice(0, 10);
  if (date === today) {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    candidates = allSlots.filter(slot => {
      // slot e.g. "09:00 AM"
      const [time, meridiem] = slot.split(" ");
      let [h, m] = time.split(":").map(Number);
      if (meridiem === "PM" && h !== 12) h += 12;
      if (meridiem === "AM" && h === 12) h = 0;
      const slotMinutes = h * 60 + m;
      return slotMinutes > nowMinutes;
    });
  }

  // now remove booked
  const query = "SELECT timeSlot FROM appointments WHERE date = ?";
  db.execute(query, [date], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const booked = results.map(r => r.timeSlot);
    const available = candidates.filter(slot => !booked.includes(slot));
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