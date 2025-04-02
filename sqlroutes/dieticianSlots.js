const express = require("express");
const db = require("../sqlconnection");
const router = express.Router();

// POST: Update Nutritionist's Slot Availability (Update if exists)
router.post("/nutritionist/slots", (req, res) => {
  try {
    const { nutritionist_id, date, SlotID } = req.body;

    // Validate the input
    if (!nutritionist_id || !date || !SlotID || !Array.isArray(SlotID)) {
      console.error("Invalid input: Missing required fields or invalid format");
      return res.status(400).json({ error: "Missing required fields or invalid format" });
    }

    // Step 1: Loop through the provided SlotIDs and validate each SlotID exists in the Slots table
    const fetchValidSlotQuery = `
      SELECT SlotID FROM Slots WHERE SlotID = ?
    `;

    // Step 2: For each SlotID, check if it exists in the Slots table and retrieve the corresponding SlotTime
    SlotID.forEach((slot) => {
      const slotID = slot.SlotID;
      const available = slot.available;

      console.log("Processing SlotID:", slotID, "with availability:", available);

      // Validate that the SlotID exists in the Slots table
      db.execute(fetchValidSlotQuery, [slotID], (err, result) => {
        if (err) {
          console.error("Error checking SlotID validity:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
          console.error(`SlotID ${slotID} does not exist in Slots table`);
          return res.status(404).json({ error: `SlotID ${slotID} does not exist in Slots table` });
        }

        console.log("SlotID", slotID, "exists in the Slots table");

        // Step 3: Update or insert the slot availability in NutritionistSlots table
        const updateSlotQuery = `
          UPDATE NutritionistSlots
          SET availability = ?, updated_at = NOW()
          WHERE nutritionist_id = ? AND SlotID = ? AND DATE(Date) = ?
        `;

        // Check if the SlotID and nutritionist_id already have an entry for the given date
        const checkSlotExistQuery = `
          SELECT 1 FROM NutritionistSlots WHERE nutritionist_id = ? AND SlotID = ? AND DATE(Date) = ?
        `;

        db.execute(checkSlotExistQuery, [nutritionist_id, slotID, date], (err, checkResult) => {
          if (err) {
            console.error("Error checking existing slot availability:", err);
            return res.status(500).json({ error: "Database error" });
          }

          if (checkResult.length > 0) {
            // Entry exists, update it
            db.execute(updateSlotQuery, [available, nutritionist_id, slotID, date], (err, result) => {
              if (err) {
                console.error("Error updating SlotID availability:", err);
                return res.status(500).json({ error: "Database error" });
              }
              console.log("Slot availability updated for SlotID:", slotID);
            });
          } else {
            // Entry does not exist, insert new one
            const insertSlotQuery = `
              INSERT INTO NutritionistSlots (nutritionist_id, SlotID, Date, availability, created_at, updated_at)
              VALUES (?, ?, ?, ?, NOW(), NOW())
            `;
            db.execute(insertSlotQuery, [nutritionist_id, slotID, date, available], (err, result) => {
              if (err) {
                console.error("Error inserting SlotID availability:", err);
                return res.status(500).json({ error: "Database error" });
              }
              console.log("Slot availability inserted for SlotID:", slotID);
            });
          }
        });
      });
    });

    // Respond after inserting or updating all SlotIDs
    res.status(200).json({
      message: "SlotID availability inserted/updated successfully",
    });

  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
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
