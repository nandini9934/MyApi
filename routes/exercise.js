const express = require("express");
const cors = require("../routes/cors");
const db = require("../sqlconnection");
const router = express.Router();
const logger = require("../logger");
const { userAuth } = require("../middleware/auth");

// Create Exercise
router.post("/exercise", userAuth, (req, res) => {
  try {
    const { exerciseName, type, videoLink, muscleType, workoutSteps, exerciseStatus, workoutImage } = req.body;

    const query = "INSERT INTO exercises (exerciseName, type, videoLink, muscleType, workoutSteps, exerciseStatus, workoutImage) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.execute(
      query,
      [
        exerciseName,
        type,
        videoLink,
        muscleType,
        workoutSteps || null,
        exerciseStatus !== undefined ? exerciseStatus : 1,
        workoutImage || null
      ],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        res.status(201).json({
          message: "Exercise created successfully",
          exercise: {
            id: result.insertId,
            exerciseName,
            type,
            videoLink,
            muscleType,
            workoutSteps,
            exerciseStatus: exerciseStatus !== undefined ? exerciseStatus : 1,
            workoutImage
          }
        });
      }
    );
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Update Exercise
router.put("/exercise/:id", userAuth, (req, res) => {
  const { id } = req.params;
  const { exerciseName, type, videoLink, muscleType, workoutSteps } = req.body;

  const query = "UPDATE exercises SET exerciseName = ?, type = ?, videoLink = ?, muscleType = ?, workoutSteps = ? WHERE id = ?";
  
  db.execute(query, [exerciseName, type, videoLink, muscleType, workoutSteps || null, id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    
    res.json({
      message: "Exercise updated successfully",
      exercise: { id, exerciseName, type, videoLink, muscleType, workoutSteps }
    });
  });
});

// Add Exercise to User (Assign an Exercise to a User)
router.post("/add-exercise", userAuth, (req, res) => {
  const { exerciseId, date } = req.body;
  const userId = req.userInfo.user.id; // Assuming you attach user ID from token

  // Check if exercise exists
  const checkExerciseQuery = "SELECT * FROM exercises WHERE id = ?";
  db.execute(checkExerciseQuery, [exerciseId], (err, results) => {
    if (err) {
      console.error("Error checking exercise:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    // Insert the exercise into user-exercises table
    const insertQuery = "INSERT INTO user_exercises (userId, exerciseId, date) VALUES (?, ?, ?)";
    db.execute(insertQuery, [userId, exerciseId, date], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(201).json({
        message: "Exercise assigned to user successfully",
        userExercise: { id: result.insertId, userId, exerciseId, date }
      });
    });
  });
});

// GET: Get all exercises (public)
router.get("/exercise", userAuth, (req, res) => {
  try {
    const query = "SELECT * FROM exercises";
    db.execute(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // If no exercises are found, return an empty array
      if (results.length === 0) {
        return res.json([]);
      }

      // Respond with the list of exercises (array only)
      res.json(results);
    });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});
  
module.exports = router;
