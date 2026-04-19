const express = require("express");
const db = require("../sqlconnection");
const router = express.Router();

// POST: Update Nutritionist's Slot Availability (Update if exists)
router.post("/nutritionist/slots", async (req, res) => {
  try {
    const { nutritionist_id, date, SlotID } = req.body;

    if (!nutritionist_id || !date || !SlotID || !Array.isArray(SlotID)) {
      return res
        .status(400)
        .json({ error: "Missing required fields or invalid format" });
    }

    const dbp = db.promise();

    const processSlot = async (slot) => {
      const slotID = slot.SlotID;
      const available = slot.available;

      const [slotCheck] = await dbp.execute(
        "SELECT SlotID FROM Slots WHERE SlotID = ?",
        [slotID]
      );
      if (slotCheck.length === 0) {
        const err = new Error(`SlotID ${slotID} does not exist in Slots table`);
        err.statusCode = 404;
        throw err;
      }

      const [existing] = await dbp.execute(
        "SELECT 1 FROM NutritionistSlots WHERE nutritionist_id = ? AND SlotID = ? AND DATE(Date) = ?",
        [nutritionist_id, slotID, date]
      );

      if (existing.length > 0) {
        await dbp.execute(
          "UPDATE NutritionistSlots SET availability = ?, updated_at = NOW() WHERE nutritionist_id = ? AND SlotID = ? AND DATE(Date) = ?",
          [available, nutritionist_id, slotID, date]
        );
      } else {
        await dbp.execute(
          "INSERT INTO NutritionistSlots (nutritionist_id, SlotID, Date, availability, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
          [nutritionist_id, slotID, date, available]
        );
      }
    };

    await Promise.all(SlotID.map(processSlot));

    return res
      .status(200)
      .json({ message: "SlotID availability inserted/updated successfully" });
  } catch (err) {
    console.error("Server error:", err.message);
    const code = err.statusCode || 500;
    return res.status(code).json({ error: err.message || "Server error" });
  }
});

// GET: Fetch Nutritionist's Available Slots for a Specific Date
router.get("/nutritionist/slots/:nutritionist_id/:date", (req, res) => {
  try {
    const { nutritionist_id, date } = req.params;

    // Validate the parameters
    if (!nutritionist_id || !date) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
    }

    console.log("Received request to fetch slots for nutritionist:", nutritionist_id, "on date:", date);

    // Step 1: Get all SlotIDs for the nutritionist on that day from NutritionistSlots table
    const slotsQuery = `
      SELECT ns.SlotID, s.SlotTime, ns.availability
      FROM NutritionistSlots ns
      JOIN Slots s ON ns.SlotID = s.SlotID
      WHERE ns.nutritionist_id = ? AND DATE(ns.Date) = ?
      ORDER BY s.SlotTime ASC
    `;

    db.execute(slotsQuery, [nutritionist_id, date], (err, slotResults) => {
      if (err) {
        console.error("Error fetching SlotIDs:", err);
        return res.status(500).json({ error: "Database error" });
      }

      console.log("Fetched SlotIDs for nutritionist:", nutritionist_id, "on date:", date);

      if (slotResults.length === 0) {
        console.log("No slots found for this nutritionist on the given date");
        return res.status(404).json({ message: "No slots found for this nutritionist on the given date" });
      }

      res.json({
        nutritionist_id,
        date,
        slots: slotResults,
      });
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
