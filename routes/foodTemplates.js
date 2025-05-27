const express = require("express");
const router = express.Router();
const db = require("../sqlconnection");
const { userAuth } = require("../middleware/auth");

/**
 * @swagger
 * /api/foodTemplates/assign:
 *   post:
 *     summary: Assign a food template to a client (nutritionist only)
 *     tags: [Food Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: templateAssignment
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - templateId
 *             - clientId
 *             - startDate
 *           properties:
 *             templateId:
 *               type: integer
 *               description: ID of the food template
 *             clientId:
 *               type: integer
 *               description: ID of the client
 *             startDate:
 *               type: string
 *               format: date
 *               description: Start date for the template
 *     responses:
 *       201:
 *         description: Template assigned successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Client not assigned to this nutritionist
 *       404:
 *         description: Template not found
 *       500:
 *         description: Database error
 */
router.post("/foodTemplates/assign", userAuth("nutritionist"), (req, res) => {
  const nutritionist_id = req.userInfo.id;
  const { templateId, clientId, startDate } = req.body;

  if (!templateId || !clientId || !startDate) {
    return res.status(400).json({ error: "templateId, clientId, and startDate are required" });
  }

  // Check if client is assigned to this nutritionist
  const checkAssignmentQuery = `
    SELECT 1 FROM nutritionist_client 
    WHERE client_id = ? AND nutritionist_id = ?
  `;
  db.execute(checkAssignmentQuery, [clientId, nutritionist_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(403).json({ error: "Client not assigned to this nutritionist" });
    }

    // Check if template exists and belongs to this nutritionist
    const checkTemplateQuery = `
      SELECT * FROM food_templates 
      WHERE id = ? AND nutritionist_id = ?
    `;
    db.execute(checkTemplateQuery, [templateId, nutritionist_id], (err, templateResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }
      if (templateResults.length === 0) {
        return res.status(404).json({ error: "Template not found" });
      }

      // Insert into client_templates table
      const insertQuery = `
        INSERT INTO client_templates (template_id, client_id, start_date, nutritionist_id)
        VALUES (?, ?, ?, ?)
      `;
      db.execute(insertQuery, [templateId, clientId, startDate, nutritionist_id], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ 
          message: "Template assigned successfully",
          assignmentId: result.insertId
        });
      });
    });
  });
});

/**
 * @swagger
 * /api/foodTemplates/client/{clientId}:
 *   get:
 *     summary: Get all templates assigned to a client
 *     tags: [Food Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the client
 *     responses:
 *       200:
 *         description: List of templates assigned to the client
 *       403:
 *         description: Client not assigned to this nutritionist
 *       500:
 *         description: Database error
 */
router.get("/foodTemplates/client/:clientId", userAuth("nutritionist"), (req, res) => {
  const nutritionist_id = req.userInfo.id;
  const { clientId } = req.params;

  // Check if client is assigned to this nutritionist
  const checkAssignmentQuery = `
    SELECT 1 FROM nutritionist_client 
    WHERE client_id = ? AND nutritionist_id = ?
  `;
  db.execute(checkAssignmentQuery, [clientId, nutritionist_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(403).json({ error: "Client not assigned to this nutritionist" });
    }

    // Get all templates assigned to this client
    const query = `
      SELECT ct.*, ft.food_ids
      FROM client_templates ct
      JOIN food_templates ft ON ct.template_id = ft.id
      WHERE ct.client_id = ? AND ct.nutritionist_id = ?
      ORDER BY ct.start_date DESC
    `;
    db.execute(query, [clientId, nutritionist_id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ templates: results });
    });
  });
});

/**
 * @swagger
 * /api/foodTemplates/template/{templateId}:
 *   get:
 *     summary: Get food items from a template
 *     tags: [Food Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the template
 *     responses:
 *       200:
 *         description: List of food items in the template
 *       404:
 *         description: Template not found
 *       500:
 *         description: Database error
 */
router.get("/foodTemplates/template/:templateId", userAuth("nutritionist"), (req, res) => {
  const nutritionist_id = req.userInfo.id;
  const { templateId } = req.params;

  // Get the template and its food items
  const query = `
    SELECT ft.food_ids, fi.*
    FROM food_templates ft
    JOIN food_items fi ON JSON_CONTAINS(ft.food_ids, CAST(JSON_ARRAY(fi.id) AS JSON))
    WHERE ft.id = ? AND ft.nutritionist_id = ?
  `;
  db.execute(query, [templateId, nutritionist_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Group food items by their IDs
    const foodItems = results.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    res.status(200).json({ foodItems });
  });
});

// Create a food template for a nutritionist

router.post("/foodTemplates", userAuth("nutritionist"), (req, res) => {
  const nutritionist_id = req.userInfo.id;
  const { food_ids } = req.body;

  if (!food_ids || !Array.isArray(food_ids)) {
    return res.status(400).json({ message: "Invalid food_ids. Must be an array." });
  }

  const query = `
    INSERT INTO food_templates (nutritionist_id, food_ids)
    VALUES (?, ?)
  `;

  db.query(query, [nutritionist_id, JSON.stringify(food_ids)], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({ message: "Food template created successfully", templateId: result.insertId });
  });
});



// Get all food templates for a nutritionist

router.get("/foodTemplates", userAuth("nutritionist"), (req, res) => {
  const nutritionist_id = req.userInfo.id;

  const query = `
    SELECT * 
    FROM food_templates
    WHERE nutritionist_id = ?
  `;

  db.query(query, [nutritionist_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ templates: results });
  });
});

// Api to update a food template by ID
// Ensure the nutritionist can only update their own templates

router.put("/foodTemplates/:id", userAuth("nutritionist"), (req, res) => {
  const nutritionist_id = req.userInfo.id;
  const { id } = req.params;
  const { food_ids } = req.body;

  if (!food_ids || !Array.isArray(food_ids)) {
    return res.status(400).json({ message: "Invalid food_ids. Must be an array." });
  }

  const query = `
    UPDATE food_templates
    SET food_ids = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND nutritionist_id = ?
  `;

  db.query(query, [JSON.stringify(food_ids), id, nutritionist_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Template not found or unauthorized" });
    }
    res.status(200).json({ message: "Food template updated successfully" });
  });
});


/**
 * @swagger
 * /api/foodTemplates/{id}:
 *   delete:
 *     summary: Delete a food template
 *     description: Delete a food template by ID (nutritionist can only delete their own templates)
 *     tags: [Food Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the food template to delete
 *     responses:
 *       200:
 *         description: Food template deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Food template deleted successfully"
 *       404:
 *         description: Template not found or unauthorized
 *       500:
 *         description: Database error
 */
router.delete("/foodTemplates/:id", userAuth("nutritionist"), (req, res) => {
  const nutritionist_id = req.userInfo.id;
  const { id } = req.params;

  const query = `
    DELETE FROM food_templates
    WHERE id = ? AND nutritionist_id = ?
  `;

  db.query(query, [id, nutritionist_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Template not found or unauthorized" });
    }
    res.status(200).json({ message: "Food template deleted successfully" });
  });
});

module.exports = router;