// // routes/auth.js
// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/postModels');
// const sendEmail = require('../mailer'); 
// const subject = require('../common/commonenums');
// const cors = require('./cors')


// // POST /signup
// router.post('/signup',cors, async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     // Check if the user already exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     // Create a new user instance
//     user = new User({ name, email, password });

//     // Save the user to the database
//     await user.save();
//     await sendEmail(email, "Welcome To Good Gut Family !", name);
//     // Create JWT token
//     const payload = { user: { id: user.id } };
//     jwt.sign(
//       payload,
//       'yourSecretKey', // Replace with your secret key
//       { expiresIn: '1h' },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token, id:user.id });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;
