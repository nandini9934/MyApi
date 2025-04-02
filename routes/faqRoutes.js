// // routes/flyerRoutes.js
// const express = require('express');
// const router = express.Router();
// const FAQ = require('../models/faq')
// const apiKeyMiddleware = require('./apikeymiddleware');
// const cors = require('./cors');
// const faq = require('../models/faq');

// // Route to save or update Image 1 URL
// router.post('/faq',cors,apiKeyMiddleware, async (req, res) => {
//   try {
//     const faq = new FAQ({
//       ques: req.body.ques,
//       ans: req.body.ans
//     });
//     await faq.save();
//     res.status(200).json({ message: 'Flyer saved successfully!' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to save Image 1.', error });
//   }
// });

// // Route to fetch saved images
// router.get('/faq', async (req, res) => {
//   try {
//     const faq= await FAQ.find();
//     if (!faq|| faq.length === 0) {
//       return res.status(204).json({ message: 'No images found.' });
//     }
//     res.status(200).json(faq);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to retrieve images.', error });
//   }
// });

// // Route to delete a flyer by ID
// router.delete('/faq/:id', async (req, res) => {
//   try {
//     const faqId = req.params.id; // Extract ID from the URL
//     const deletedFAQ = await FAQ.findByIdAndDelete(faqId);

//     if (!deletedFAQ) {
//       return res.status(404).json({ message: 'FAQ not found.' });
//     }

//     res.status(200).json({ message: 'FAQ deleted successfully.', faq: deletedFAQ });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete FAQ.', error });
//   }
// });

// module.exports = router;
