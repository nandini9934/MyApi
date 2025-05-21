const express = require("express");
const cors = require("../routes/cors");
const db = require("../sqlconnection");
const router = express.Router();
const { userAuth } = require("../middleware/auth");

// GET: Get user metadata (user auth required)
router.get("/metadata", userAuth, (req, res) => {
  const userID = req.userInfo.user.id;
  console.log(`[GET /metadata] Request received from user ID: ${userID}`);

  const query = `
      SELECT
        UserData.*,
        UserLogins.name, UserLogins.email, UserLogins.isSubscribed
      FROM 
        UserData
      RIGHT JOIN 
        UserLogins ON UserData.id = UserLogins.id
      WHERE 
        UserLogins.id = ?
    `;

  db.execute(query, [userID], (err, results) => {
    if (err) {
      console.error("[GET /metadata] Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      console.warn("[GET /metadata] No metadata found for user ID:", userID);
      return res.status(404).json({ error: "ID not found" });
    }

    console.log("[GET /metadata] Metadata retrieved for user ID:", userID);
    res.json(results[0]);
  });
});

// PUT: Update user metadata (user auth required)
router.put("/metadata", userAuth, (req, res) => {
  const userID = req.userInfo.user.id;
  console.log(`[PUT /metadata] Update request received from user ID: ${userID}`);
  console.log("[PUT /metadata] Request body:", req.body);

  const allowedFields = [
    "gender", "dob", "height", "weight", "medical", "goal",
    "bodyfat", "workout", "food", "occupation", "onboarded", "targetWeight"
  ];

  if (req.body.dob) {
    const input = req.body.dob;
    const parsed = new Date(input);
    if (!isNaN(parsed)) {
      const yyyy = parsed.getFullYear();
      const mm = String(parsed.getMonth() + 1).padStart(2, '0');
      const dd = String(parsed.getDate()).padStart(2, '0');
      req.body.dob = `${yyyy}-${mm}-${dd}`;
      console.log(`[PUT /metadata] Converted DOB to: ${req.body.dob}`);
    }
  }

  const fieldsToUpdate = Object.keys(req.body).filter(field => allowedFields.includes(field));

  if (fieldsToUpdate.length === 0) {
    console.warn("[PUT /metadata] No valid fields provided in request body.");
    return res.status(400).json({ error: "No valid fields provided for update" });
  }

  const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(", ");
  const values = fieldsToUpdate.map(field => req.body[field]);
  values.push(userID);

  const query = `UPDATE UserData SET ${setClause} WHERE id = ?`;

  db.execute(query, values, (err, result) => {
    if (err) {
      console.error("[PUT /metadata] Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      console.warn(`[PUT /metadata] No user found with ID: ${userID}`);
      return res.status(404).json({ error: "ID not found" });
    }

    console.log(`[PUT /metadata] Metadata updated for user ID: ${userID}`);
    res.json({ message: "User metadata updated successfully" });
  });
});

module.exports = router;
