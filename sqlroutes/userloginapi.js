const express = require("express"); // Import your Mongoose model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../mailer");
const cors = require("../routes/cors");
const db = require("../sqlconnection");
const router = express.Router();
const logger = require("../logger");

router.post("/users", async (req, res) => {
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

    const signupdate = new Date(); // Current timestamp

    // Insert the data into the UserLogins table

    const query =
      "INSERT INTO UserLogins (name, email, password, signupdate) VALUES (?, ?, ?, ?)";
    db.execute(
      query,
      [name, email, password, signupdate],
      async (err, result) => {
        if (err) {
          await logger("Error inserting data:" + err + "Time:-" + signupdate);
          return res.status(500).json({ error: "Database error" });
        } else {
          await sendEmail(email, "Welcome To Good Gut Family !", name);
          await logger(
            `\n New User has been registered with mail:- ${email} , Time:-${signupdate}`
          );
        }
        const payload = { user: { id: result.insertId } };
        jwt.sign(
          payload,
          "yourSecretKey", // Replace with your secret key
          { expiresIn: "1h" },
          (err, token) => {
            if (err) throw err;
            res.json({
              token,
              id: result.insertId,
              message: "User registred successfully",
            });
          }
        );
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/users", async (req, res) => {
  const query = "SELECT * FROM UserLogins";
  db.execute(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

router.post("/login", cors, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const query = "SELECT id,password FROM UserLogins where email = ?";
    db.execute(query, [email], async (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!results) {
        return res
          .status(404)
          .json({ msg: "No account found with this email" });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, results[0]?.password);
      if (!isMatch) {
        return res.status(401).json({ msg: "Invalid Credentials" });
      }

      //Create JWT token
      const payload = { user: { id: results[0]?.id } };
      jwt.sign(
        payload,
        "yourSecretKey", // Replace with your secret key
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token, userId: results[0].id });
        }
      );
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
