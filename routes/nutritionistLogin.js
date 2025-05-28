const express = require("express");
const router = express.Router();
const db = require("../sqlconnection");
const bcrypt = require("bcryptjs");
const { userAuth } = require("../middleware/auth");

const jwt = require("jsonwebtoken");
const ggpKey = process.env.GGP_SECRET_KEY;

/**
 * @swagger
 * /api/nutritionistSignUp:
 *   post:
 *     summary: Register a new nutritionist
 *     description: Create a new nutritionist account with the provided details
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - phone_number
 *               - specialty
 *               - years_of_experience
 *               - current_organisation
 *               - address
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phone_number:
 *                 type: string
 *                 example: "1234567890"
 *               specialty:
 *                 type: string
 *                 example: "Sports Nutrition"
 *               years_of_experience:
 *                 type: integer
 *                 example: 5
 *               current_organisation:
 *                 type: string
 *                 example: "Healthy Living Clinic"
 *               address:
 *                 type: string
 *                 example: "123 Health Street, Nutrition City"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123!"
 *     responses:
 *       201:
 *         description: Nutritionist registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nutritionist registered successfully"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Missing required fields or email already registered
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/nutritionistSignIn:
 *   post:
 *     summary: Authenticate nutritionist and get token
 *     description: Sign in a nutritionist with email and password to receive an authentication token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - PASSWORD
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               PASSWORD:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123!"
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 nutritionist:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     first_name:
 *                       type: string
 *                       example: "John"
 *                     last_name:
 *                       type: string
 *                       example: "Doe"
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/nutritionistUpdate:
 *   put:
 *     summary: Update nutritionist profile
 *     description: Update nutritionist's profile information (at least one field required)
 *     tags: [Nutritionist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               phone_number:
 *                 type: string
 *                 example: "1234567890"
 *               specialty:
 *                 type: string
 *                 example: "Sports Nutrition"
 *               years_of_experience:
 *                 type: integer
 *                 example: 6
 *               current_organisation:
 *                 type: string
 *                 example: "Healthy Living Clinic"
 *               address:
 *                 type: string
 *                 example: "123 Health Street, Nutrition City"
 *     responses:
 *       200:
 *         description: Nutritionist profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *       400:
 *         description: No fields provided for update
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/nutritionist/delete-account:
 *   delete:
 *     summary: Delete nutritionist account
 *     description: Deletes the authenticated nutritionist's account and all related data
 *     tags: [Nutritionist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Current password for verification
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Password is required
 *       401:
 *         description: Invalid password
 *       404:
 *         description: Nutritionist not found
 *       500:
 *         description: Server error
 */
router.delete('/delete-account', userAuth, async (req, res) => {
  const { password } = req.body;
  const nutritionistId = req.user.id;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    // Verify password
    const nutritionistQuery = 'SELECT password FROM nutritionists WHERE id = ?';
    db.query(nutritionistQuery, [nutritionistId], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Nutritionist not found' });
      }

      const validPassword = await bcrypt.compare(password, results[0].password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      // Delete related data
      const deleteQueries = [
        // Delete client templates associated with this nutritionist
        'DELETE FROM client_templates WHERE nutritionist_id = ?',
        // Delete food templates created by this nutritionist
        'DELETE FROM food_templates WHERE nutritionist_id = ?',
        // Delete nutritionist account
        'DELETE FROM nutritionists WHERE id = ?'
      ];

      // Execute all delete queries
      for (const query of deleteQueries) {
        db.query(query, [nutritionistId], (err) => {
          if (err) {
            console.error('Error deleting data:', err);
          }
        });
      }

      res.status(200).json({ message: 'Account deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;