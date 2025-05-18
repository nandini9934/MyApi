const mysql = require("mysql2");

// Create a MySQL connection pool (recommended for better performance and scalability)
const db = mysql.createPool({
  host: "sql12.freesqldatabase.com", // Update with your MySQL host
  user: "sql12779294", // Update with your MySQL user
  password: "Z6KwBqxXlZ", // Update with your MySQL password
  database: "sql12779294", // Update with your MySQL database name
  waitForConnections: true, // Makes sure connections are queued while waiting for an available one
  connectionLimit: 10, // Maximum number of connections to create in the pool
  queueLimit: 0, // Unlimited queue length (set a limit if needed)
  dateStrings: true,
});

// Test DB connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database");
  connection.release(); // Release connection back to the pool
});

// Export the database connection
module.exports = db;