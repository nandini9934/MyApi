const express = require("express");
const bodyParser = require("body-parser");
const userLoginApi = require("./routes/userLogin"); // Import the userloginapi route file
const logger = require("./routes/loggerController");
const flyers = require("./routes/flyer");
const faq = require("./routes/faq");
const passport = require('passport');
const session = require('express-session');
const food = require("./routes/foodItems");
const target = require("./routes/target");
const consumed = require("./routes/consumed");
const exercise = require("./routes/exercise");
const userMeta = require("./routes/userMeta");
const waterSleep = require("./routes/waterSleep");
const appointments = require("./routes/appointments");

const app = express();
const port = 3000;

const { exec } = require("child_process");
const cors = require("cors");

// Session middleware
app.use(session({
  secret: process.env.GGP_SECRET_KEY || 'your_session_secret',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: [
      "https://www.goodgutproject.in",
      "https://goodgutproject.in",
      "http://localhost:3000",
      "https://admindashboard-nu-lovat.vercel.app",
      "https://myapinew.onrender.com",
    ],
    credentials: true
  })
);
// Handle preflight requests (OPTIONS)
app.options("*", (req, res) => {
  const allowedOrigins = [
    "https://www.goodgutproject.in",
    "https://goodgutproject.in",
    "http://localhost:3000",
    "https://admindashboard-nu-lovat.vercel.app",
    "https://myapinew.onrender.com",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.sendStatus(200);
});

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use("/api", userLoginApi); // Use the userLoginApi routes under "/api"
app.use("/api", logger);
app.use("/api", food);
app.use("/api", flyers);
app.use("/api", faq);
app.use("/api", target);
app.use("/api", consumed);
app.use("/api", exercise);
app.use("/api", userMeta);
app.use("/api", waterSleep);
app.use("/api", appointments);

app.get("/test", (req, res) => {
  res.send("App restartedss");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
