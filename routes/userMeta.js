const express = require("express");
const cors = require("../routes/cors");
const db = require("../sqlconnection");
const router = express.Router();
const logger = require("../logger");
const { userAuth } = require("../middleware/auth");

// GET: Get user metadata (user auth required)
router.get("/metadata", userAuth, (req, res) => {
  const userID = req.userInfo.user.id;
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
      console.error("Error fetching user metadata:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "ID not found" });
    }

    res.json(results[0]);
  });
});

router.put("/metadata", userAuth, (req, res) => {
  const userID = req.userInfo.user.id;
  const allowedFields = [
    "gender", "dob", "height", "weight", "medical", "goal",
    "bodyfat", "workout", "food", "occupation", "onboarded", "targetWeight"
  ];

  // If dob is present and not in yyyy-mm-dd, try to convert it
  if (req.body.dob) {
    const input = req.body.dob;
    // Try to parse formats like '3 August 1995'
    const parsed = new Date(input);
    if (!isNaN(parsed)) {
      // Format to yyyy-mm-dd
      const yyyy = parsed.getFullYear();
      const mm = String(parsed.getMonth() + 1).padStart(2, '0');
      const dd = String(parsed.getDate()).padStart(2, '0');
      req.body.dob = `${yyyy}-${mm}-${dd}`;
    }
    // else leave as is, DB will error if it's not valid
  }

  // Filter only fields present in req.body and allowedFields
  const fieldsToUpdate = Object.keys(req.body).filter(field => allowedFields.includes(field));

  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ error: "No valid fields provided for update" });
  }

  // Build SET clause and values array
  const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(", ");
  const values = fieldsToUpdate.map(field => req.body[field]);
  values.push(userID); // For WHERE id = ?

  const query = `UPDATE UserData SET ${setClause} WHERE id = ?`;

  db.execute(query, values, (err, result) => {
    if (err) {
      console.error("Error updating user metadata:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "ID not found" });
    }

    res.json({ message: "User metadata updated successfully" });
  });
});

module.exports = router;