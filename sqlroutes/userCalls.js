const express = require("express");
const db = require("../sqlconnection");
const auth = require("../routes/auth");
const router = express.Router();

// POST: Schedule a Call between User and Nutritionist
router.post("/call", auth, (req, res) => {
  try {
    const { scheduled_date, scheduled_time } = req.body;

    const user_id = req.userInfo.user.id;

    // Validate the input
    if (!scheduled_date || !scheduled_time) {
      return res.status(400).json({ error: "Missing required fields: scheduled_date or scheduled_time" });
    }

    // Step 1: Fetch the nutritionist_id assigned to the user
    const getNutritionistQuery = `
      SELECT assignNutritionist FROM UserData WHERE id = ?
    `;

    db.execute(getNutritionistQuery, [user_id], (err, results) => {
      if (err) {
        console.error("Error fetching user nutritionist ID:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const nutritionist_id = results[0].assignNutritionist;

      if (!nutritionist_id) {
        return res.status(400).json({ error: "No nutritionist assigned to this user" });
      }

      // Step 2: Insert the call schedule data into the userCalls table
      const query = `
        INSERT INTO userCalls (user_id, nutritionist_id, scheduled_date, scheduled_time, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'pending', NOW(), NOW())
      `;

      db.execute(query, [user_id, nutritionist_id, scheduled_date, scheduled_time], (err, result) => {
        if (err) {
          console.error("Error scheduling call:", err);
          return res.status(500).json({ error: "Database error" });
        }

        // Respond with the unique ID of the newly created call schedule
        res.status(201).json({
          message: "Call scheduled successfully",
          call_id: result.insertId // The unique ID of the newly created call schedule
        });
      });
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

// GET: Fetch User's Scheduled Calls
router.get("/calls", auth, (req, res) => {
  try {
    const user_id = req.userInfo.user.id;

    // Query to fetch the call schedule data for the authenticated user
    const query = `
      SELECT id, user_id, nutritionist_id, scheduled_date, scheduled_time, status, created_at, updated_at
      FROM userCalls
      WHERE user_id = ?
      ORDER BY scheduled_date DESC, scheduled_time DESC
    `;

    db.execute(query, [user_id], (err, results) => {
      if (err) {
        console.error("Error fetching user calls:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // If no records are found, return a message indicating no scheduled calls
      if (results.length === 0) {
        return res.status(404).json({ message: "No scheduled calls found for this user" });
      }

      // Return the user's scheduled calls data
      res.json({
        message: "User's scheduled calls fetched successfully",
        calls: results
      });
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

// PUT: Update the status or time of an existing call
router.put("/call/:call_id", auth, (req, res) => {
  try {
    const { call_id } = req.params; // Call ID from the request URL
    const { scheduled_date, scheduled_time, status } = req.body;

    // Validate required fields for update
    if (!scheduled_date && !scheduled_time && !status) {
      return res.status(400).json({ error: "At least one field (scheduled_date, scheduled_time, status) must be provided for update" });
    }

    // Prepare the fields to update
    const updateFields = [];
    const updateValues = [];
    let updateQuery = "UPDATE userCalls SET ";

    if (scheduled_date) {
      updateFields.push("scheduled_date = ?");
      updateValues.push(scheduled_date);
    }

    if (scheduled_time) {
      updateFields.push("scheduled_time = ?");
      updateValues.push(scheduled_time);
    }

    if (status) {
      updateFields.push("status = ?");
      updateValues.push(status);
    }

    // Add the WHERE condition
    updateQuery += updateFields.join(", ") + " WHERE id = ?";

    // Include the call_id in the values to ensure it's updated for the correct call
    updateValues.push(call_id);

    // Execute the update query
    db.execute(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error("Error updating call:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // If no rows were affected, the call_id may not exist
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Call not found" });
      }

      res.status(200).json({
        message: "Call updated successfully"
      });
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
