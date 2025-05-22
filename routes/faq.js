const express = require("express");
const cors = require("../routes/cors");
const db = require("../sqlconnection");
const router = express.Router();
const logger = require("../logger");
const { userAuth } = require("../middleware/auth");

/**
 * @swagger
 * /api/faq:
 *   post:
 *     summary: Create a new FAQ entry
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - answer
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *     responses:
 *       201:
 *         description: FAQ created successfully
 *       500:
 *         description: Server or database error
 */
router.post("/faq", userAuth, (req, res) => {
  try {
    let { question, answer } = req.body;

    const query = "INSERT INTO faq (question, answer) VALUES (?, ?)";
    
    db.execute(query, [question, answer], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      
      res.status(201).json({
        message: "FAQ created successfully",
        faq: { id: result.insertId, question, answer }
      });
    });
    
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @swagger
 * /api/faq:
 *   get:
 *     summary: Get all FAQ entries
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all FAQs
 *       500:
 *         description: Server or database error
 */
router.get("/faq", userAuth, async (req, res) => {
  const query = "SELECT * FROM faq";
  db.execute(query, (err, results) => {
    if (err) {
      console.error("Error fetching FAQs:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

/**
 * @swagger
 * /api/faq/{id}:
 *   delete:
 *     summary: Delete a FAQ entry by ID
 *     tags: [FAQ]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the FAQ to delete
 *     responses:
 *       200:
 *         description: Deleted successfully or ID not found
 *       500:
 *         description: Server or database error
 */
router.delete('/faq/:id', userAuth, async (req, res) => {
  const faqId = req.params.id;

  const query = "DELETE FROM faq WHERE id = ?";
  db.execute(query, [faqId], (err, results) => {
    if (err) {
      console.error("Error deleting FAQ:", err);
      return res.status(500).json({ error: "Database error" });
    } else if (results.affectedRows == 0) {
      res.json({ message: "ID not found" });
    } else {
      res.json({ message: "Deleted successfully" });
    }
  });
});

module.exports = router;
