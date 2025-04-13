// nutritionists.js
// This file contains the routes for the nutritionists table in the database.
// It provides endpoints for CRUD operations on the nutritionists table.


const express = require("express");
const db = require("../sqlconnection"); // Assuming this is your DB connection file
const auth = require("../routes/auth"); // Assuming you have an authentication middleware
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ggpKey = process.env.GGP_SECRET_KEY; // Use the same secret key as the rest of the app

// POST: Create a new Nutritionist
router.post("/nutritionists", (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      specialty,
      years_of_experience,
      current_organisation,
      address
    } = req.body;

    // Validate input
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert the new nutritionist into the database
    const query = `
      INSERT INTO nutritionists 
      (first_name, last_name, email, phone_number, specialty, years_of_experience, current_organisation, address, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    db.execute(query, [first_name, last_name, email, phone_number || null, specialty || null, years_of_experience || null, current_organisation || null, address || null], (err, result) => {
      if (err) {
        console.error("Error adding nutritionist:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(201).json({ 
        message: "Nutritionist created successfully",
        nutritionist: {
          id: result.insertId,
          first_name,
          last_name,
          email,
          phone_number,
          specialty,
          years_of_experience,
          current_organisation,
          address
        }
      });
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

// POST: Nutritionist Sign-Up
router.post("/nutritionists/signup", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone_number,
      specialty,
      years_of_experience,
      current_organisation,
      address
    } = req.body;

    // Validate input
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Check if email already exists
    const checkEmailQuery = "SELECT id FROM nutritionists WHERE email = ?";
    db.execute(checkEmailQuery, [email], async (err, results) => {
      if (err) {
        console.error("Error checking email:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new nutritionist into the database
    const query = `
      INSERT INTO nutritionists 
      (first_name, last_name, email, password, phone_number, specialty, years_of_experience, current_organisation, address, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    db.execute(query, [first_name, last_name, email, hashedPassword, phone_number || null, specialty || null, years_of_experience || null, current_organisation || null, address || null], (err, result) => {
      if (err) {
        console.error("Error signing up nutritionist:", err);
        return res.status(500).json({ error: "Database error" });
      }

        // Generate JWT token
        const payload = { user: { id: result.insertId, role: 'nutritionist' } };
        const token = jwt.sign(payload, ggpKey, { expiresIn: '10h' });

      res.status(201).json({
        message: "Nutritionist signed up successfully",
          token,
        nutritionist: {
          id: result.insertId,
          first_name,
          last_name,
          email,
          phone_number,
          specialty,
          years_of_experience,
          current_organisation,
          address
        }
        });
      });
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

// GET: Get all Nutritionists
router.get("/nutritionists", (req, res) => {
  const query = "SELECT * FROM nutritionists";

  db.execute(query, (err, results) => {
    if (err) {
      console.error("Error fetching nutritionists:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// GET: Get a single Nutritionist by ID
router.get("/nutritionists/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM nutritionists WHERE id = ?";

  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching nutritionist:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Nutritionist not found" });
    }
    res.json(results[0]);
  });
});

// PUT: Update a Nutritionist (single parameter update supported)
router.put("/nutritionists/:id",  (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone_number, specialty, years_of_experience, current_organisation, address } = req.body;

    // Build dynamic SET clause based on the provided fields
    let setClause = [];
    let values = [];

    if (first_name) {
      setClause.push("first_name = ?");
      values.push(first_name);
    }
    if (last_name) {
      setClause.push("last_name = ?");
      values.push(last_name);
    }
    if (email) {
      setClause.push("email = ?");
      values.push(email);
    }
    if (phone_number) {
      setClause.push("phone_number = ?");
      values.push(phone_number);
    }
    if (specialty) {
      setClause.push("specialty = ?");
      values.push(specialty);
    }
    if (years_of_experience) {
      setClause.push("years_of_experience = ?");
      values.push(years_of_experience);
    }
    if (current_organisation) {
      setClause.push("current_organisation = ?");
      values.push(current_organisation);
    }
    if (address) {
      setClause.push("address = ?");
      values.push(address);
    }

    // If no valid fields are passed for update, return error
    if (setClause.length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    // Add the nutritionist ID at the end of values array
    values.push(id);

    // Construct the dynamic query for the update
    const query = `
      UPDATE nutritionists 
      SET ${setClause.join(", ")}, updated_at = NOW() 
      WHERE id = ?
    `;

    db.execute(query, values, (err, result) => {
      if (err) {
        console.error("Error updating nutritionist:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Nutritionist not found" });
      }

      res.json({
        message: "Nutritionist updated successfully",
        nutritionist: {
          id,
          first_name,
          last_name,
          email,
          phone_number,
          specialty,
          years_of_experience,
          current_organisation,
          address
        }
      });
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

// DELETE: Delete a Nutritionist
router.delete("/nutritionists/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM nutritionists WHERE id = ?";
  
  db.execute(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting nutritionist:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Nutritionist not found" });
    }

    res.json({
      message: "Nutritionist deleted successfully"
    });
  });
});

// POST: Nutritionist Login
router.post("/nutritionists/login", async (req, res) => {
  try {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const query = "SELECT * FROM nutritionists WHERE email = ?";
  db.execute(query, [email], async (err, results) => {
    if (err) {
      console.error("Error fetching nutritionist:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const nutritionist = results[0];

      // Verify password
    const isPasswordValid = await bcrypt.compare(password, nutritionist.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
      const payload = { user: { id: nutritionist.id, role: 'nutritionist' } };
      const token = jwt.sign(payload, ggpKey, { expiresIn: '10h' });

    res.json({
      message: "Login successful",
      token,
        nutritionist: {
          id: nutritionist.id,
          first_name: nutritionist.first_name,
          last_name: nutritionist.last_name,
          email: nutritionist.email,
          phone_number: nutritionist.phone_number,
          specialty: nutritionist.specialty,
          years_of_experience: nutritionist.years_of_experience,
          current_organisation: nutritionist.current_organisation,
          address: nutritionist.address
        }
      });
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

// GET: Get all clients for a nutritionist
router.get("/nutritionists/:id/clients", auth, async (req, res) => {
  try {
    const nutritionistId = req.params.id;
    
    // Verify that the logged-in user is the nutritionist
    if (req.userInfo.user.id !== parseInt(nutritionistId) || req.userInfo.user.role !== 'nutritionist') {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const query = `
      SELECT 
        u.id as client_id,
        u.name,
        u.email,
        ud.gender,
        ud.height,
        ud.weight,
        ud.medical,
        ud.goal,
        ud.bodyfat,
        ud.workout,
        ud.food,
        nc.status,
        nc.start_date,
        nc.notes
      FROM nutritionist_clients nc
      JOIN UserLogins u ON nc.client_id = u.id
      LEFT JOIN UserData ud ON u.id = ud.userId
      WHERE nc.nutritionist_id = ?
      ORDER BY nc.created_at DESC
    `;

    db.execute(query, [nutritionistId], (err, results) => {
      if (err) {
        console.error("Error fetching clients:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

// POST: Add a new client to a nutritionist
router.post("/nutritionists/:id/clients", auth, async (req, res) => {
  try {
    const nutritionistId = req.params.id;
    const { clientId, notes } = req.body;

    // Verify that the logged-in user is the nutritionist
    if (req.userInfo.user.id !== parseInt(nutritionistId) || req.userInfo.user.role !== 'nutritionist') {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Check if client exists
    const checkClientQuery = "SELECT id FROM UserLogins WHERE id = ?";
    db.execute(checkClientQuery, [clientId], (err, results) => {
      if (err) {
        console.error("Error checking client:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Client not found" });
      }

      // Add client to nutritionist's list
      const query = `
        INSERT INTO nutritionist_clients 
        (nutritionist_id, client_id, notes)
        VALUES (?, ?, ?)
      `;

      db.execute(query, [nutritionistId, clientId, notes || null], (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Client is already assigned to this nutritionist" });
          }
          console.error("Error adding client:", err);
          return res.status(500).json({ error: "Database error" });
        }

        res.status(201).json({
          message: "Client added successfully",
          relationship: {
            id: result.insertId,
            nutritionist_id: nutritionistId,
            client_id: clientId,
            notes
          }
        });
      });
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

// PUT: Update client status or notes
router.put("/nutritionists/:nutritionistId/clients/:clientId", auth, async (req, res) => {
  try {
    const { nutritionistId, clientId } = req.params;
    const { status, notes } = req.body;

    // Verify that the logged-in user is the nutritionist
    if (req.userInfo.user.id !== parseInt(nutritionistId) || req.userInfo.user.role !== 'nutritionist') {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Build update query based on provided fields
    let updates = [];
    let values = [];

    if (status) {
      updates.push("status = ?");
      values.push(status);
    }
    if (notes !== undefined) {
      updates.push("notes = ?");
      values.push(notes);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    values.push(nutritionistId, clientId);

    const query = `
      UPDATE nutritionist_clients
      SET ${updates.join(", ")}, updated_at = NOW()
      WHERE nutritionist_id = ? AND client_id = ?
    `;

    db.execute(query, values, (err, result) => {
      if (err) {
        console.error("Error updating client relationship:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Client relationship not found" });
      }

      res.json({
        message: "Client relationship updated successfully",
        updates: { status, notes }
      });
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

// DELETE: Remove a client from a nutritionist
router.delete("/nutritionists/:nutritionistId/clients/:clientId", auth, async (req, res) => {
  try {
    const { nutritionistId, clientId } = req.params;

    // Verify that the logged-in user is the nutritionist
    if (req.userInfo.user.id !== parseInt(nutritionistId) || req.userInfo.user.role !== 'nutritionist') {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const query = `
      DELETE FROM nutritionist_clients
      WHERE nutritionist_id = ? AND client_id = ?
    `;

    db.execute(query, [nutritionistId, clientId], (err, result) => {
      if (err) {
        console.error("Error removing client:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Client relationship not found" });
      }

      res.json({ message: "Client removed successfully" });
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;