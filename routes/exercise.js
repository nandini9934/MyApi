const express = require("express");
const cors = require("../routes/cors");
const db = require("../sqlconnection");
const router = express.Router();
const logger = require("../logger");
const { userAuth } = require("../middleware/auth");

/**
 * @swagger
 * /api/exercise:
 *   post:
 *     summary: Create a new exercise
 *     tags: [Exercise]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exerciseName
 *               - type
 *               - videoLink
 *               - muscleType
 *             properties:
 *               exerciseName:
 *                 type: string
 *               type:
 *                 type: string
 *               videoLink:
 *                 type: string
 *               muscleType:
 *                 type: string
 *               workoutSteps:
 *                 type: string
 *               exerciseStatus:
 *                 type: integer
 *               workoutImage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Exercise created successfully
 *       500:
 *         description: Database or server error
 */
router.post("/exercise", userAuth, (req, res) => {
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
});

/**
 * @swagger
 * /api/exercise/{id}:
 *   put:
 *     summary: Update an existing exercise by ID
 *     tags: [Exercise]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exercise ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exerciseName
 *               - type
 *               - videoLink
 *               - muscleType
 *             properties:
 *               exerciseName:
 *                 type: string
 *               type:
 *                 type: string
 *               videoLink:
 *                 type: string
 *               muscleType:
 *                 type: string
 *               workoutSteps:
 *                 type: string
 *     responses:
 *       200:
 *         description: Exercise updated successfully
 *       404:
 *         description: Exercise not found
 *       500:
 *         description: Database error
 */
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

/**
 * @swagger
 * /api/add-exercise:
 *   post:
 *     summary: Assign an exercise to the logged-in user
 *     tags: [Exercise]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exerciseId
 *               - date
 *             properties:
 *               exerciseId:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Exercise assigned to user
 *       404:
 *         description: Exercise not found
 *       500:
 *         description: Database error
 */
router.post("/add-exercise", userAuth, (req, res) => {
  const { exerciseId, date } = req.body;
  const userId = req.userInfo.user.id;

  const checkExerciseQuery = "SELECT * FROM exercises WHERE id = ?";
  db.execute(checkExerciseQuery, [exerciseId], (err, results) => {
    if (err) {
      console.error("Error checking exercise:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Exercise not found" });
    }

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

/**
 * @swagger
 * /api/exercise:
 *   get:
 *     summary: Get all exercises
 *     tags: [Exercise]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all exercises
 *       500:
 *         description: Database error
 */
router.get("/exercise", userAuth, (req, res) => {
  const query = "SELECT * FROM exercises";
  db.execute(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

/**
 * @swagger
 * /api/user-exercises/{date}:
 *   get:
 *     summary: Get all exercises assigned to the logged-in user for a specific date
 *     tags: [Exercise]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for which exercises are fetched
 *     responses:
 *       200:
 *         description: List of assigned exercises
 *       500:
 *         description: Database error
 */
router.get("/user-exercises/:date", userAuth, (req, res) => {
  const userId = req.userInfo.user.id;
  const { date } = req.params;
  const query = `
    SELECT ue.id as userExerciseId, ue.date, e.*
    FROM user_exercises ue
    JOIN exercises e ON ue.exerciseId = e.id
    WHERE ue.userId = ? AND ue.date = ?
    ORDER BY ue.date DESC
  `;
  db.execute(query, [userId, date], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

module.exports = router;
