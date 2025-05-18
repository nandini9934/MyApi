const express = require("express"); // Import your Mongoose model
const cors = require("../routes/cors");
const db = require("../sqlconnection");
const router = express.Router();
const logger = require("../logger");
const { userAuth } = require("../middleware/auth");


  router.post("/flyer", userAuth, async (req, res) => {
    try {
      let { name, imageUrl,description, url} = req.body;
  
      const query = "INSERT INTO flyers (name, imageUrl,description,url) VALUES (?, ?, ?,?)";
      
      db.execute(query, [name, imageUrl,description, url], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }
        
        res.status(201).json({
          message: "Flyer created successfully",
          flyer: { id: result.insertId, name, imageUrl,description, url }
        });
      });
      
    } catch (err) {
      console.error("Server error:", err.message);
      res.status(500).send("Server error");
    }
  });

router.get("/flyer", userAuth, async (req, res) => {
  const query = "SELECT * FROM flyers";
  db.execute(query, (err, results) => {
    if (err) {
      console.error("Error fetching flyers:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});



module.exports = router;
