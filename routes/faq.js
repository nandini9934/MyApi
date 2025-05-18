const express = require("express"); // Import your Mongoose model
const cors = require("../routes/cors");
const db = require("../sqlconnection");
const router = express.Router();
const logger = require("../logger");
const { userAuth } = require("../middleware/auth");


  router.post("/faq", userAuth, (req, res) => {
    try {
      let { question, answer} = req.body;
  
      const query = "INSERT INTO faq (question, answer) VALUES (?, ?)";
      
      db.execute(query, [question, answer], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }
        
        res.status(201).json({
          message: "Flyer created successfully",
          faq: { id: result.insertId, question,answer}
        });
      });
      
    } catch (err) {
      console.error("Server error:", err.message);
      res.status(500).send("Server error");
    }
  });

router.get("/faq", userAuth, async (req, res) => {
  const query = "SELECT * FROM faq";
  db.execute(query, (err, results) => {
    if (err) {
      console.error("Error fetching flyers:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

router.delete('/faq/:id', userAuth, async (req, res) => {
    const faqId = req.params.id;

    const query = "DELETE FROM faq WHERE id = ?";
    db.execute(query,[faqId], (err, results) => {
        if (err) {
          console.error("Error deleting faq:", err);
          return res.status(500).json({ error: "Database error" });
        }
        else if(results.affectedRows==0)
            res.json({message:"ID not found"});
        else
        res.json({message:"Deleted Successfully"});
      });
});


module.exports = router;
