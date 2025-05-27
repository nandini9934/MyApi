const express = require("express");
const db = require("../sqlconnection");
const { userAuth } = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * /api/target/nutritionist:
 *   post:
 *     summary: Add target food for a client (nutritionist only)
 *     tags: [Targets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the client
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: Target date
 *       - in: query
 *         name: foodId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the food item
 *     responses:
 *       201:
 *         description: Target added successfully
 *       400:
 *         description: Missing required parameters
 *       403:
 *         description: Client not assigned to this nutritionist
 *       409:
 *         description: Already in target
 *       500:
 *         description: Database error
 */
router.post("/target/nutritionist", userAuth("nutritionist"), (req, res) => {
  const nutritionistId = req.userInfo.id;
  const { clientId, date, foodId } = req.query;

  if (!clientId || !date || !foodId) {
    return res.status(400).json({ error: "clientId, date, and foodId are required" });
  }

  // Check if client is assigned to this nutritionist
  const checkAssignmentQuery = `
    SELECT 1 FROM nutritionist_client 
    WHERE client_id = ? AND nutritionist_id = ?
  `;
  db.execute(checkAssignmentQuery, [clientId, nutritionistId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(403).json({ error: "Client not assigned to this nutritionist" });
    }

    const insert = `
      INSERT INTO target (userId, nutritionistId, date, foodId, isConsumed)
      VALUES (?, ?, ?, ?, 0)
    `;
    db.execute(insert, [clientId, nutritionistId, date, foodId], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Already in target" });
        }
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "Added to target", id: result.insertId });
    });
  });
});

/**
 * @swagger
 * /api/target/assignTemplate:
 *   post:
 *     summary: Assign a food template to a client (nutritionist only)
 *     tags: [Targets]
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
// Assign a template to a client (nutritionist only)
router.post("/target/assignTemplate", userAuth(["nutritionist"]), async (req, res) => {
  const nutritionistId = req.userInfo.id;
  const { templateId, clientId, startDate } = req.body;

  if (!templateId || !clientId || !startDate) {
    return res.status(400).json({ error: "templateId, clientId, and startDate are required" });
  }

  // Start a database transaction
  const connection = await db.promise().getConnection();
  
  try {
    await connection.beginTransaction();

    // 1. Verify nutritionist-client relationship
    const [assignment] = await connection.execute(
      'SELECT 1 FROM nutritionist_client WHERE client_id = ? AND nutritionist_id = ?',
      [clientId, nutritionistId]
    );

    if (assignment.length === 0) {
      await connection.rollback();
      return res.status(403).json({ error: 'Client not assigned to this nutritionist' });
    }

    // 2. Get template food items
    const [template] = await connection.execute(
      'SELECT food_ids FROM food_templates WHERE id = ? AND nutritionist_id = ?',
      [templateId, nutritionistId]
    );

    if (template.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Template not found' });
    }

    const foodIds = JSON.parse(template[0].food_ids);
    if (!Array.isArray(foodIds) || foodIds.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Template has no food items' });
    }

    // 3. Insert each food item into target table
    const insertQuery = `
      INSERT INTO target
      (userId, foodId, date, isConsumed, id, created_at)
      VALUES (?, ?, ?, 0, ?, NOW())
      ON DUPLICATE KEY UPDATE created_at = NOW()`;

    for (const foodId of foodIds) {
      await connection.execute(insertQuery, [clientId, foodId, startDate, nutritionistId]);
    }

    await connection.commit();
    res.status(201).json({ message: 'Template assigned successfully' });

  } catch (error) {
    await connection.rollback();
    console.error('Error assigning template:', error);
    res.status(500).json({ error: 'Failed to assign template' });
  } finally {
    connection.release();
  }
});

/**
 * @swagger
 * /api/target/clientTemplates/{clientId}:
 *   get:
 *     summary: Get all templates assigned to a client
 *     tags: [Targets]
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
// Get all templates assigned to a client (nutritionist only)
router.get("/target/clientTemplates/:clientId", userAuth(["nutritionist"]), (req, res) => {
  const nutritionistId = req.userInfo.id;
  const { clientId } = req.params;

  // Check if client is assigned to this nutritionist
  const checkAssignmentQuery = `
    SELECT 1 FROM nutritionist_client 
    WHERE client_id = ? AND nutritionist_id = ?
  `;
  db.execute(checkAssignmentQuery, [clientId, nutritionistId], (err, results) => {
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
    db.execute(query, [clientId, nutritionistId], (err, results) => {
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
 * /api/target/templateFood/{templateId}:
 *   get:
 *     summary: Get food items from a template
 *     tags: [Targets]
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
// Get food items from a template (nutritionist only)
router.get("/target/templateFood/:templateId", userAuth(["nutritionist"]), (req, res) => {
  const nutritionistId = req.userInfo.id;
  const { templateId } = req.params;

  // Get the template and its food items
  const query = `
    SELECT ft.food_ids, fi.*
    FROM food_templates ft
    JOIN food_items fi ON JSON_CONTAINS(ft.food_ids, CAST(JSON_ARRAY(fi.id) AS JSON))
    WHERE ft.id = ? AND ft.nutritionist_id = ?
  `;
  db.execute(query, [templateId, nutritionistId], (err, results) => {
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

/**
 * @swagger
 * /api/target:
 *   post:
 *     summary: Add target food for self (user)
 *     tags: [Targets]
 *     summary: Add a food item to the user's target for a given date
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date for which the food is being added
 *       - in: query
 *         name: foodId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the food item
 *     responses:
 *       201:
 *         description: Food item added to target
 *       400:
 *         description: Missing date or foodId
 *       409:
 *         description: Already in target
 *       500:
 *         description: Database error
 */
router.post("/target", userAuth(["nutritionist"]), (req, res) => {
  const nutritionistId = req.userInfo.id;
  const { date, foodId } = req.query;

  if (!date || !foodId) {
    return res.status(400).json({ error: "date and foodId are required" });
  }

  const insert = `
    INSERT INTO target (userId, date, foodId, isConsumed)
    VALUES (?, ?, ?, 0)
  `;
  db.execute(insert, [nutritionistId, date, foodId], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Already in target" });
      }
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Added to target", id: result.insertId });
  });
});

/**
 * @swagger
 * /api/target/{date}:
 *   get:
 *     summary: Get all planned food items for a given date
 *     tags: [Target]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date to retrieve the food plan for
 *     responses:
 *       200:
 *         description: List of food items with target status
 *       500:
 *         description: Database error
 */
// Get target meals for a specific date (accessible by both clients and nutritionists)
router.get("/target/:date", userAuth(["user", "nutritionist"]), (req, res) => {
  const nutritionistId = req.userInfo.id;
  const { date } = req.params;

  if (!date) return res.status(400).json({ error: "date is required" });

  const query = `
    SELECT
      t.foodId       AS id,
      f.name,
      f.kcal,
      f.p, f.c, f.f,
      f.image,
      f.isVeg,
      f.mealType,
      f.recipe,
      t.isConsumed
    FROM target AS t
    JOIN food_items AS f
      ON f.id = t.foodId
    WHERE t.userId = ?
      AND t.date   = ?
    ORDER BY f.mealType, f.name
  `;
  db.execute(query, [nutritionistId, date], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// Delete a food item from target (accessible by both clients and nutritionists)
/**
 * @swagger
 * /api/target:
 *   delete:
 *     summary: Remove a food item from target
 *     description: Remove a food item from the user's target for a specific date
 *     tags: [Targets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date from which to remove the food item
 *       - in: query
 *         name: foodId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the food item to remove
 *     responses:
 *       200:
 *         description: Successfully removed from target
 *       400:
 *         description: Missing date or foodId
 *       404:
 *         description: Not found in target
 *       500:
 *         description: Database error
 */
router.delete("/target", userAuth(["user", "nutritionist"]), (req, res) => {
  // Get user ID based on role (user or nutritionist)
  const userId = req.userInfo.user?.id || req.userInfo.id;
  const { date, foodId } = req.query;

  if (!date || !foodId) {
    return res.status(400).json({ error: "date and foodId are required" });
  }

  const del = `
    DELETE FROM target
     WHERE userId = ?
       AND date   = ?
       AND foodId = ?
  `;
  db.execute(del, [userId, date, foodId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Not in target" });
    }
    res.json({ message: "Removed from target", foodId });
  });
});

module.exports = router;
