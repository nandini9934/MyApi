const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../mailer");
const cors = require("../routes/cors");
const db = require("../sqlconnection");
const router = express.Router();
const logger = require("../logger");
const { userAuth } = require("../middleware/auth");
const passport = require('passport');
const sendEmailReset = require("../password-reset-email")
const ggpKey = process.env.GGP_SECRET_KEY;
//const cid = process.env.CLIENT_ID;
//const csecret = process.env.CLIENT_SECRET;
const apiKeyMiddleware = require("../middleware/apikeymiddleware");

// Initialize passport
require('../config/passport');

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
 *   - name: User Data
 *     description: User profile data management
 *   - name: Account Management
 *     description: Account verification and password management
 *   - name: OAuth
 *     description: Google OAuth authentication endpoints
 */

/**
 * @swagger
 * api/auth/google:
 *   get:
 *     tags: [OAuth]
 *     summary: Initiate Google OAuth authentication
 *     description: Redirects to Google's OAuth consent screen
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               example: https://accounts.google.com/o/oauth2/v2/auth?scope=profile%20email
 */

// Google OAuth login route
router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

/**
 * @swagger
 * api/auth/google/callback:
 *   get:
 *     tags: [OAuth]
 *     summary: Google OAuth callback
 *     description: Handles Google OAuth callback and redirects with token
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *     responses:
 *       302:
 *         description: Redirect to frontend with JWT token
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               example: https://frontend.com/auth-success?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

// Google OAuth callback route
router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    const { token, user } = req.user;
    
    // You can customize this response based on your frontend needs
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
  }
);

/**
 * @swagger
 * api/signup:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields or user already exists
 *       500:
 *         description: Server error
 */

router.post("/signup", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    // Ensure that name, email, and password are provided
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    const getQuery = "SELECT * FROM UserLogins where email = ?";
    db.execute(getQuery, [email], (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: "User Already Registered" });
      }
    });
    const signupdate = new Date(); // Current timestamp

    // Insert the data into the UserLogins table

    const query =
      "INSERT INTO UserLogins (name, email, password, signupdate, auth_provider) VALUES (?, ?, ?, ?, 'local')";
    db.execute(
      query,
      [name, email, password, signupdate],
      async (err, result) => {
        if (err) {
          await logger("Error inserting data:" + err + "Time:-" + signupdate);
          return res.status(500).json({ error: "Database error" });
        } else {
          const updateQuery =
            "UPDATE UserLogins SET auth_token = ? WHERE id = ?";
          const id = result.insertId;
          const payload = { user: { id: id } };
          jwt.sign(
            payload,
            ggpKey, // Replace with your secret key
            { expiresIn: "10h" },
            (err, token) => {
              if (err) throw err;
              db.execute(updateQuery, [token, id], async (error, result) => {
                if (error) {
                  res.status(500).json({ msg: "Error in creating token" });
                } else {
                  await sendEmail(
                    email,
                    "Welcome To Good Gut Family !",
                    name,
                    token
                  );
                  await logger(
                    `\n New User has been registered with mail:- ${email} , Time:-${signupdate}`
                  );
                }
              });
              res.json({
                msg: "User registred successfully",
              });
            }
          );
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @swagger
 * api/users:
 *   get:
 *     tags: [User Data]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Database error
 */

router.get("/users", async (req, res) => {
  const query = "SELECT * FROM UserLogins";
  db.execute(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Database error" });
    } else {
      res.json({ Users: results });
    }
  });
});

/**
 * @swagger
 * api/login:
 *   post:
 *     tags: [Authentication]
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.post("/login", cors, async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const query = "SELECT id,password,isActive FROM UserLogins where email = ?";
    db.execute(query, [email], async (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ error: "Database error " + err });
      }

      if (results.length == 0) {
        return res
          .status(404)
          .json({ msg: "No account found with this email" });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, results[0]?.password);
      if (!isMatch) {
        return res.status(401).json({ msg: "Invalid Credentials" });
      }

      if (results[0].isActive == 0) {
        return res.status(403).json({ msg: "Please activate your account" });
      }

      //Create JWT token
      const payload = { user: { id: results[0]?.id } };
      jwt.sign(
        payload,
        ggpKey, // Replace with your secret key
        { expiresIn: "10h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @swagger
 * api/userdata:
 *   post:
 *     tags: [User Data]
 *     summary: Create or update user profile data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserData'
 *     responses:
 *       201:
 *         description: Data inserted successfully
 *       200:
 *         description: Data updated successfully
 *       500:
 *         description: Database error
 */

router.post("/userdata", userAuth, (req, res) => {
  const userID = req?.userInfo?.user?.id;

  const newQuery = "SELECT * FROM UserData WHERE userId = ?";
  db.execute(newQuery, [userID], (error, result) => {
    if (error) {
      return res.status(500).json({ msg: "Database Error" });
    }

    if (result.length > 0) {
      const updates = req.body;

      const fields = Object.keys(updates)
        .map((key) => `${key} = ?`)
        .join(", ");

      const values = Object.values(updates);

      const sql = `
        UPDATE UserData
        SET ${fields}
        WHERE userId = ?
      `;

      db.query(sql, [...values, userID], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to update data" });
        }

        if (result.affectedRows > 0) {
          return res.status(200).json({ message: "Data updated successfully" });
        } else {
          return res.status(500).json({ message: "Data Not updated" });
        }
      });
    } else {
      const {
        gender,
        dob,
        height,
        weight,
        medical,
        goal,
        bodyfat,
        workout,
        food,
        occupation,
        onboarded,
        targetWeight,
      } = req.body;

      const sql = `
        INSERT INTO UserData (userId, gender, dob, height, weight, medical, goal, bodyfat, workout, food, occupation, onboarded,targetWeight)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true,?)
      `;

      db.query(
        sql,
        [
          userID,
          gender,
          dob,
          height,
          weight,
          medical,
          goal,
          bodyfat,
          workout,
          food,
          occupation,
          onboarded,
          targetWeight,
        ],
        (err, result) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ error: "Failed to insert data" + err });
          }

          if (result.affectedRows > 0) {
            return res
              .status(201)
              .json({ message: "Data inserted successfully" });
          } else {
            return res.status(500).json({ message: "Data not inserted" });
          }
        }
      );
    }
  });
});

/**
 * @swagger
 * api/verify-token:
 *   post:
 *     tags: [Account Management]
 *     summary: Verify JWT token validity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token is valid
 *       400:
 *         description: Token required
 *       401:
 *         description: Invalid or expired token
 */

router.post("/verify-token", (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  try {
    jwt.verify(token, ggpKey);
    return res.status(200).json({ success: true, message: "Token is valid" });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token is invalid or expired" });
  }
});

/**
 * @swagger
 * api/verifyuser:
 *   post:
 *     tags: [Account Management]
 *     summary: Verify user account
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account activated successfully
 *       400:
 *         description: Invalid token payload
 *       500:
 *         description: Database error
 */

router.post("/verifyuser", apiKeyMiddleware, (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, ggpKey);
    const id = decoded?.user?.id;

    if (!id) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    const query = "SELECT auth_token, isActive FROM UserLogins WHERE id = ?";
    db.execute(query, [id], (error, result) => {
      if (error) {
        console.error("Database error:", error);
        return res
          .status(200)
          .json({ title: "Sorry", message: "Something Went Wrong" });
      }

      if (result.length === 0) {
        return res.status(200).json({ title: "", message: "User not found" });
      }
      const newCon = "temp";
      const { auth_token, isActive } = result[0];

      if (isActive === 1) {
        return res.status(200).json({
          title: "Thank You!",
          message: "Your Account is already activated",
        });
      }

      if (auth_token !== token) {
        return res.status(200).json({ title: "", message: "Invalid token" });
      }

      const updateQuery = "UPDATE UserLogins SET isActive = 1 WHERE id = ?";
      db.execute(updateQuery, [id], (updateError) => {
        if (updateError) {
          console.error("Update error:", updateError);
          return res.status(200).json({
            title: "Sorry",
            message: "Failed to activate account. Please try again later.",
          });
        }

        res.status(200).json({
          title: "Thank You!",
          message: "Your account has been activated",
        });
      });
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(200).json({
      title: "Sorry",
      message: "Token expired or invalid. Please regenerate your token.",
    });
  }
});

/**
 * @swagger
 * api/forgot-password:
 *   post:
 *     tags: [Account Management]
 *     summary: Initiate password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Email required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

// POST /forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Check if the user exists
  const query = "SELECT * FROM UserLogins WHERE email = ?";
  db.execute(query, [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // Generate a reset token (valid for 1 hour)
    const payload = { user: { id: results[0].id } };
    const resetToken = jwt.sign(payload, ggpKey, { expiresIn: "1h" });

    // Send reset email using the new password-reset-email.js
    try {
      await sendEmailReset(
        email,
        "Password Reset Request",
        results[0].name || "User",
        resetToken
      );
      return res.status(200).json({ message: "Password reset email sent" });
    } catch (mailErr) {
      console.error("Error sending email:", mailErr);
      return res.status(500).json({ message: "Failed to send reset email" });
    }
  });
});

/**
 * @swagger
 * api/reset-password:
 *   post:
 *     tags: [Account Management]
 *     summary: Reset user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: User not found
 *       500:
 *         description: Database error
 */

// POST /reset-password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const query = "UPDATE UserLogins SET password = ? WHERE email = ?";
  db.execute(query, [hashedPassword, email], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No account found with this email" });
    }
    res.status(200).json({ message: "Password reset successfully" });
  });
});

/**
 * @swagger
 * api/delete-account:
 *   post:
 *     tags: [Account Management]
 *     summary: Delete user account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       404:
 *         description: Account not found
 *       500:
 *         description: Database error
 */

// POST /delete-account
router.post("/delete-account", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;
  const query = "DELETE FROM UserLogins WHERE id = ?";
  db.execute(query, [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Account not found" });
    }
    res.status(200).json({ message: "Account deleted successfully" });
  });
});

/**
 * @swagger
 * api/deactivate-subscription:
 *   post:
 *     tags: [Account Management]
 *     summary: Deactivate user subscription
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription deactivated
 *       404:
 *         description: Account not found
 *       500:
 *         description: Database error
 */

// POST /deactivate-subscription
router.post("/deactivate-subscription", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;
  const query = "UPDATE UserLogins SET isActive = 0 WHERE id = ?";
  db.execute(query, [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Account not found" });
    }
    res.status(200).json({ message: "Subscription deactivated successfully" });
  });
});

/**
 * @swagger
 * api/version:
 *   get:
 *     summary: Get API version
 *     responses:
 *       200:
 *         description: API version information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */

router.get("/version", cors, async (req, res) => {
  try {
    res.status(200).json({ version: "1.0.0" }); // Send saved sale as a response
  } catch (err) {
    res.status(500).json({ message: "Error fecthing version" });
  }
});

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *     apiKey:
 *       type: apiKey
 *       in: header
 *       name: X-API-Key
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         signupdate:
 *           type: string
 *           format: date-time
 *         auth_provider:
 *           type: string
 *     UserData:
 *       type: object
 *       properties:
 *         gender:
 *           type: string
 *         dob:
 *           type: string
 *           format: date
 *         height:
 *           type: number
 *         weight:
 *           type: number
 *         medical:
 *           type: string
 *         goal:
 *           type: string
 *         bodyfat:
 *           type: number
 *         workout:
 *           type: string
 *         food:
 *           type: string
 *         occupation:
 *           type: string
 *         targetWeight:
 *           type: number
 */


module.exports = router;
