const express = require("express");
const db = require("../sqlconnection");
const router = express.Router();

// GET: Get all food items
router.get("/fooditems", (req, res) => {
  const query = "SELECT * FROM food_items ORDER BY created_at DESC";
  
  db.execute(query, (err, results) => {
    if (err) {
      console.error("Error fetching food items:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// GET: Get food items by meal type
router.get("/fooditems/:mealType", (req, res) => {
  const { mealType } = req.params;
  const query = "SELECT * FROM food_items WHERE mealType = ? ORDER BY created_at DESC";
  
  db.execute(query, [mealType], (err, results) => {
    if (err) {
      console.error("Error fetching food items:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// POST: Add a new food item
router.post("/fooditems", (req, res) => {
  try {
    const {
      name,
      quantity,
      kcal,
      p,
      c,
      f,
      image,
      isVeg,
      isSelected,
      mealType
    } = req.body;

    // Validate required fields
    if (!name || !quantity || !kcal || !p || !c || !f || !mealType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const query = `
      INSERT INTO food_items 
      (name, quantity, kcal, p, c, f, image, isVeg, isSelected, mealType)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.execute(
      query,
      [name, quantity, kcal, p, c, f, image || null, isVeg, isSelected || false, mealType],
      (err, result) => {
        if (err) {
          console.error("Error adding food item:", err);
          return res.status(500).json({ error: "Database error" });
        }

        res.status(201).json({
          message: "Food item added successfully",
          foodItem: {
            id: result.insertId,
            name,
            quantity,
            kcal,
            p,
            c,
            f,
            image,
            isVeg,
            isSelected,
            mealType
          }
        });
      }
    );
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

// PUT: Update a food item
router.put("/fooditems/:id", (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      quantity,
      kcal,
      p,
      c,
      f,
      image,
      isVeg,
      isSelected,
      mealType
    } = req.body;

    // Build dynamic SET clause based on the provided fields
    let setClause = [];
    let values = [];

    if (name) {
      setClause.push("name = ?");
      values.push(name);
    }
    if (quantity) {
      setClause.push("quantity = ?");
      values.push(quantity);
    }
    if (kcal) {
      setClause.push("kcal = ?");
      values.push(kcal);
    }
    if (p) {
      setClause.push("p = ?");
      values.push(p);
    }
    if (c) {
      setClause.push("c = ?");
      values.push(c);
    }
    if (f) {
      setClause.push("f = ?");
      values.push(f);
    }
    if (image !== undefined) {
      setClause.push("image = ?");
      values.push(image);
    }
    if (isVeg !== undefined) {
      setClause.push("isVeg = ?");
      values.push(isVeg);
    }
    if (isSelected !== undefined) {
      setClause.push("isSelected = ?");
      values.push(isSelected);
    }
    if (mealType) {
      setClause.push("mealType = ?");
      values.push(mealType);
    }

    // If no valid fields are passed for update, return error
    if (setClause.length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    // Add the food item ID at the end of values array
    values.push(id);

    // Construct the dynamic query for the update
    const query = `
      UPDATE food_items 
      SET ${setClause.join(", ")}
      WHERE id = ?
    `;

    db.execute(query, values, (err, result) => {
      if (err) {
        console.error("Error updating food item:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Food item not found" });
      }

      res.json({
        message: "Food item updated successfully",
        foodItem: {
          id,
          name,
          quantity,
          kcal,
          p,
          c,
          f,
          image,
          isVeg,
          isSelected,
          mealType
        }
      });
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

// DELETE: Delete a food item
router.delete("/fooditems/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM food_items WHERE id = ?";
  
  db.execute(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting food item:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json({
      message: "Food item deleted successfully"
    });
  });
});

module.exports = router; 