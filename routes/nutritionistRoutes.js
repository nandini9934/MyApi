const express = require("express");
const router = express.Router();
const db = require("../sqlconnection");
const { userAuth } = require("../middleware/auth");

// Assign a client to a nutritionist
router.post("/assignClient", userAuth("nutritionist"), (req, res) => {
  const { client_id, client_status } = req.body;
  const nutritionist_id = req.userInfo.id;

  if (!client_id || !client_status) {
    return res.status(400).json({ message: "Client ID and status are required." });
  }

  const insertQuery = `
    INSERT INTO nutritionist_client (client_id, nutritionist_id, client_status) 
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE client_status = VALUES(client_status), updated_at = NOW()
  `;

  db.query(insertQuery, [client_id, nutritionist_id, client_status], (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({ message: "Client assigned successfully." });
  });
});

// Get a client's nutritionist
router.get("/clientNutritionist/:client_id", userAuth("nutritionist"), (req, res) => {
  const { client_id } = req.params;

  const query = `
    SELECT n.id, n.first_name, n.last_name, n.email, nc.client_status, nc.updated_at
    FROM nutritionists n
    JOIN nutritionist_client nc ON n.id = nc.nutritionist_id
    WHERE nc.client_id = ?
  `;

  db.query(query, [client_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No nutritionist found for this client." });
    }
    res.status(200).json({ nutritionist: results[0] });
  });
});

// Get all clients for a nutritionist
router.get("/nutritionistClients", userAuth("nutritionist"), (req, res) => {
  const nutritionist_id = req.userInfo.id;

  const query = `
    SELECT ul.id
    FROM UserLogins ul
    JOIN nutritionist_client nc ON ul.id = nc.client_id
    WHERE nc.nutritionist_id = ?
  `;

  db.query(query, [nutritionist_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ clients: results });
  });
});

// Update a nutritionist's client status
router.put("/updateClientStatus", userAuth("nutritionist"), (req, res) => {
  const { client_id, client_status } = req.body;
  const nutritionist_id = req.userInfo.id;

  if (!client_id || !client_status) {
    return res.status(400).json({ message: "Client ID and status are required." });
  }

  const updateQuery = `
    UPDATE nutritionist_client 
    SET client_status = ?, updated_at = NOW() 
    WHERE client_id = ? AND nutritionist_id = ?
  `;

  db.query(updateQuery, [client_status, client_id, nutritionist_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Client not found or not assigned to this nutritionist." });
    }
    res.status(200).json({ message: "Client status updated successfully." });
  });
});

// Remove a client from a nutritionist
router.delete("/removeClient", userAuth("nutritionist"), (req, res) => {
  const { client_id } = req.body;
  const nutritionist_id = req.userInfo.id;

  if (!client_id) {
    return res.status(400).json({ message: "Client ID is required." });
  }

  const deleteQuery = `
    DELETE FROM nutritionist_client 
    WHERE client_id = ? AND nutritionist_id = ?
  `;

  db.query(deleteQuery, [client_id, nutritionist_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Client not found or not assigned to this nutritionist." });
    }
    res.status(200).json({ message: "Client removed successfully." });
  });
});

module.exports = router;
