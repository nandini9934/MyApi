const express = require("express");
const router = express.Router();
const db = require("../sqlconnection");
const { userAuth } = require("../middleware/auth");

// Create a food template for a nutritionist

router.post("/foodTemplates", userAuth("nutritionist"), (req, res) => {
  const nutritionist_id = req.userInfo.id;
  const { food_ids } = req.body;

  if (!food_ids || !Array.isArray(food_ids)) {
    return res.status(400).json({ message: "Invalid food_ids. Must be an array." });
  }

  const query = `
    INSERT INTO food_templates (nutritionist_id, food_ids)
    VALUES (?, ?)
  `;

  db.query(query, [nutritionist_id, JSON.stringify(food_ids)], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({ message: "Food template created successfully", templateId: result.insertId });
  });
});



// Get all food templates for a nutritionist

router.get("/foodTemplates", userAuth("nutritionist"), (req, res) => {
  const nutritionist_id = req.userInfo.id;

  const query = `
    SELECT * 
    FROM food_templates
    WHERE nutritionist_id = ?
  `;

  db.query(query, [nutritionist_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ templates: results });
  });
});

// Api to update a food template by ID
// Ensure the nutritionist can only update their own templates

router.put("/foodTemplates/:id", userAuth("nutritionist"), (req, res) => {
  const nutritionist_id = req.userInfo.id;
  const { id } = req.params;
  const { food_ids } = req.body;

  if (!food_ids || !Array.isArray(food_ids)) {
    return res.status(400).json({ message: "Invalid food_ids. Must be an array." });
  }

  const query = `
    UPDATE food_templates
    SET food_ids = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND nutritionist_id = ?
  `;

  db.query(query, [JSON.stringify(food_ids), id, nutritionist_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Template not found or unauthorized" });
    }
    res.status(200).json({ message: "Food template updated successfully" });
  });
});


// Api to delete a food template by ID
// Ensure the nutritionist can only delete their own templates

router.delete("/foodTemplates/:id", userAuth("nutritionist"), (req, res) => {
  const nutritionist_id = req.userInfo.id;
  const { id } = req.params;

  const query = `
    DELETE FROM food_templates
    WHERE id = ? AND nutritionist_id = ?
  `;

  db.query(query, [id, nutritionist_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Template not found or unauthorized" });
    }
    res.status(200).json({ message: "Food template deleted successfully" });
  });
});

module.exports = router;