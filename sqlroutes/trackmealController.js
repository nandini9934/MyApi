const express = require("express"); // Import your Mongoose model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../mailer");
const cors = require("../routes/cors");
const db = require("../sqlconnection");
const router = express.Router();
const logger = require("../logger");
const auth = require("../routes/auth");

router.post("/addmeal", cors, auth, async (req, res) => {
  const userID = req?.userInfo?.user?.id;
  const {
    mealDate,
    name,
    quantity,
    kcal,
    p,
    c,
    f,
    image,
    isVeg,
    mealType,
  } = req.body;

  // Validate required fields
  if (!userID || !mealDate || !quantity || !kcal || !p || !c || !f || !mealType) {
    return res.status(400).json({
      message: "Missing required fields. Please provide all necessary data.",
      received: { userID, mealDate, name, quantity, kcal, p, c, f, mealType },
    });
  }

  const query = `
        INSERT INTO MealByDate (
          userId, mealDate, name, quantity, kcal, p, c, f, image, isVeg, mealType, isSelected
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `;

  db.execute(
    query,
    [
      userID,
      mealDate,
      name || "Unnamed Meal", // Provide a default value if name is missing
      quantity,
      kcal,
      p,
      c,
      f,
      image || null, // Use null if image is not provided
      isVeg !== undefined ? isVeg : null, // Use null if isVeg is not provided
      mealType,
    ],
    (error, result) => {
      if (error) {
        console.error("Error adding meal:", error);
        res
          .status(500)
          .json({ message: "An error occurred while adding the meal." });
      } else {
        res.status(201).json({
          message: "Meal added successfully",
        });
      }
    }
  );
});

router.get("/trackmeal", cors, auth, (req, res) => {
  const { date } = req.query; // Read from query params, not body
  const userID = req?.userInfo?.user?.id;

  if (!date || !userID) {
    return res.status(400).json({ 
      msg: "Missing required parameters: date and userID must be provided.",
      received: { date, userID }
    });
  }

  const query = "SELECT * FROM MealByDate WHERE userId = ? AND mealDate = ?";
  db.execute(query, [userID, date], (error, result) => {
    if (error) {
      logger.error("Database error:", error); // Log the full error
      res.status(500).json({ msg: "Database error: " + error.message });
    } else {
      res.status(200).json({ meals: result });
    }
  });
});

router.delete("/trackmeal", cors, auth, (req, res) => {
  const { mealId } = req.body;
  const query = "DELETE FROM MealByDate WHERE mealId = ?";
  db.execute(query, [mealId], (error, result) => {
    if (error) {
      res.status(500).json({ msg: "Database error" });
    } else {
      res.status(200).json({ msg: "Successfully deleted meal" });
    }
  });
});

router.put("/selectmeal", cors, (req, res) => {
  const { mealId, isSelected } = req.body;
  const query = "UPDATE MealByDate SET isSelected = ? Where mealId = ?";
  db.query(query, [mealId, isSelected], (error, result) => {
    if (error) {
      res.status(500).json({ msg: "DB Error" });
    } else {
      res.status(200).json({ msg: "Meal selected successfully" });
    }
  });
});

router.post("/addtargetmeal", cors, async (req, res) => {
  const {
    userId,
    mealDate,
    name,
    quantity,
    kcal,
    p,
    c,
    f,
    image,
    isVeg,
    mealType,
  } = req.body;

  const query = `
        INSERT INTO MealByDate (
          userId, mealDate, name, quantity, kcal, p, c, f, image, isVeg, mealType, isSelected, isTargetMeal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)
      `;

  db.execute(
    query,
    [
      userId,
      mealDate,
      name,
      quantity,
      kcal,
      p,
      c,
      f,
      image,
      isVeg,
      mealType,
    ],
    (error, result) => {
      if (error) {
        console.error("Error adding meal:", error);
        res
          .status(500)
          .json({ message: "An error occurred while adding the meal." });
      } else {
        res.status(201).json({
          message: "Meal added successfully",
        });
      }
    }
  );
});

module.exports = router;
