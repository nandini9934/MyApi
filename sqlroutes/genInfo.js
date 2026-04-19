const express = require("express"); // Import your Mongoose model
const cors = require("../routes/cors");
const db = require("../sqlconnection");
const router = express.Router();
const logger = require("../logger");
const auth = require("../routes/auth");

router.post("/dailytrack", cors, auth, (req, res) => {
  const userID = req?.userInfo?.user?.id;
  const { selectedDate } = req.body;

  const query =
    "Select * from DailyTrack Where selectedDate = ? AND userId = ?";

  db.execute(query, [selectedDate, userID], (error, result) => {
    if (!error) {
      console.log(selectedDate, userID);
      if (result?.length > 0) {
        const updates = req.body;

        const fields = Object.keys(updates)
          .map((key) => `${key} = ?`)
          .join(", ");

        const values = Object.values(updates);

        const sql = `
            UPDATE DailyTrack
            SET ${fields}
            WHERE userId = ?
          `;

        db.query(sql, [...values, userID], (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Failed to update data" });
          }

          if (result.affectedRows > 0) {
            return res
              .status(200)
              .json({ message: "Data updated successfully" });
          } else {
            return res.status(500).json({ message: "Data Not updated" });
          }
        });
      } else {
        const { selectedDate, sleepHours, waterIntake, steps } = req.body;
        const query =
          "INSERT INTO DailyTrack (userId,selectedDate,sleepHours,waterIntake,steps) Values (?,?,?,?,?)";

        db.execute(
          query,
          [
            userID,
            selectedDate,
            sleepHours ? sleepHours : 0,
            waterIntake ? waterIntake : 0,
            steps ? steps : 0,
          ],
          (error, result) => {
            if (error) {
              return res
                .status(500)
                .json({ message: "Error in Adding data" + error });
            } else {
              return res.status(201).json({ message: "New data added" });
            }
          }
        );
      }
    }
  });
});

router.get("/dailytrack", cors, auth, (req, res) => {
  const userID = req?.userInfo?.user?.id;
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: "Missing required query parameter: date" });
  }
  const query =
    "SELECT selectedDate, sleepHours, waterIntake, steps FROM DailyTrack WHERE userId = ? AND selectedDate = ?";
  db.execute(query, [userID, date], (err, results) => {
    if (err) {
      console.error("Error fetching dailytrack:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.json({
        selectedDate: date,
        sleepHours: 0,
        waterIntake: 0,
        steps: 0,
      });
    }
    return res.json(results[0]);
  });
});

router.get("/geninfo", async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Missing required query parameter: id" });
  }
  const query = "SELECT * FROM GenInfo WHERE id = ?";
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching geninfo:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(results[0]);
  });
});

module.exports = router;
