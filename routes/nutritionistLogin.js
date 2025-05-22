const express = require("express");
const router = express.Router();
const db = require("../sqlconnection");
const bcrypt = require("bcryptjs");
const { userAuth } = require("../middleware/auth");

const jwt = require("jsonwebtoken");
const ggpKey = process.env.GGP_SECRET_KEY;

router.post("/nutritionistSignUp", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    specialty,
    years_of_experience,
    current_organisation,
    address,
    password,
  } = req.body;

  // Check required fields
  if (
    !first_name ||
    !last_name ||
    !email ||
    !phone_number ||
    !specialty ||
    !years_of_experience ||
    !current_organisation ||
    !address ||
    !password
  ) {
    return res.status(400).json({ message: "All fields including password are required." });
  }

  try {
    // Check if email already exists
    const checkQuery = "SELECT * FROM nutritionists WHERE email = ?";
    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: "Nutritionist already registered with this email." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert nutritionist
      const insertQuery = `
        INSERT INTO nutritionists 
        (first_name, last_name, email, phone_number, specialty, years_of_experience, current_organisation, address, password) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertQuery,
        [
          first_name,
          last_name,
          email,
          phone_number,
          specialty,
          years_of_experience,
          current_organisation,
          address,
          hashedPassword,
        ],
        (err, result) => {
          if (err) {
            return res.status(500).json({ message: "Insert failed", error: err });
          }

          return res.status(201).json({ message: "Nutritionist registered successfully." });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

router.post("/nutritionistSignIn", (req, res) => {
  const { email, PASSWORD } = req.body;

  if (!email || !PASSWORD) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const findQuery = "SELECT * FROM nutritionists WHERE email = ?";
  db.query(findQuery, [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      console.log("No user found for email:", email);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const nutritionist = results[0];
    console.log("Query Results:", nutritionist);

    // Debugging bcrypt.compare arguments
    console.log("Provided Password:", PASSWORD);
    console.log("Hashed Password from DB:", nutritionist.PASSWORD);

    try {
      const passwordMatch = await bcrypt.compare(PASSWORD, nutritionist.PASSWORD);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const payload = {
        user: {
          id: nutritionist.id,
          email: nutritionist.email,
          first_name: nutritionist.first_name,
          last_name: nutritionist.last_name,
          role: "nutritionist",
        },
      };

      const token = jwt.sign(payload, ggpKey, { expiresIn: "7d" });
      res.status(200).json({
        message: "Login successful",
        token,
        user: payload.user,
      });
    } catch (bcryptError) {
      console.error("Bcrypt error:", bcryptError);
      return res.status(500).json({ message: "Internal server error." });
    }
  });
});

router.put("/nutritionistUpdate", userAuth("nutritionist"), (req, res) => {
  const {
    first_name,
    last_name,
    phone_number,
    specialty,
    years_of_experience,
    current_organisation,
    address,
  } = req.body;

  // Ensure at least one field is provided for update
  if (
    !first_name &&
    !last_name &&
    !phone_number &&
    !specialty &&
    !years_of_experience &&
    !current_organisation &&
    !address
  ) {
    return res
      .status(400)
      .json({ message: "At least one field is required for updating." });
  }

  // Dynamically construct the query based on provided fields
  const updates = [];
  const values = [];

  if (first_name) {
    updates.push("first_name = ?");
    values.push(first_name);
  }
  if (last_name) {
    updates.push("last_name = ?");
    values.push(last_name);
  }
  if (phone_number) {
    updates.push("phone_number = ?");
    values.push(phone_number);
  }
  if (specialty) {
    updates.push("specialty = ?");
    values.push(specialty);
  }
  if (years_of_experience) {
    updates.push("years_of_experience = ?");
    values.push(years_of_experience);
  }
  if (current_organisation) {
    updates.push("current_organisation = ?");
    values.push(current_organisation);
  }
  if (address) {
    updates.push("address = ?");
    values.push(address);
  }

  // Add the nutritionist ID from req.userInfo
  const userId = req.userInfo.id; // `req.userInfo` is set by `userAuth`
  values.push(userId);

  const updateQuery = `UPDATE nutritionists SET ${updates.join(", ")} WHERE id = ?`;

  // Execute the query
  db.query(updateQuery, values, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "No nutritionist found to update." });
    }

    res.status(200).json({ message: "Profile updated successfully." });
  });
});



module.exports = router;