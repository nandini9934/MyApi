// // routes/flyerRoutes.js
// const express = require('express');
// const router = express.Router();
// const BODY = require('../models/bodyData')
// const apiKeyMiddleware = require('./apikeymiddleware');
// const cors = require('./cors');


// // Route to save or update Image 1 URL
// router.post('/body', async (req, res) => {
//   try {
//     const bodyData = new BODY({
//       weight: req.body.weight, // Default to 0 instead of an empty string
//   BMI: req.body.BMI,
//   bodyfat: req.body.bodyfat,
//   fatfree: req.body.fatfree,
//   subfat: req.body.subfat,
//   visfat: req.body.visfat,
//   bodywater: req.body.bodywater,
//   sketmus: req.body.sketmus,
//   musmass: req.body.musmass,
//   bonemass: req.body.bonemass,
//   protein: req.body.protein,
//   BMR: req.body.BMR,
//   metaage: req.body.metaage
//     });
//     await bodyData.save();
//     res.status(200).json({ message: 'Flyer saved successfully!' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to save Image 1.', error });
//   }
// });

// // Route to fetch saved images
// router.get('/body', async (req, res) => {
//   try {
//     const bodyData= await BODY.find();
//     if (!bodyData|| bodyData.length === 0) {
//       return res.status(204).json({ message: 'No images found.' });
//     }
//     res.status(200).json(bodyData);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to retrieve images.', error });
//   }
// });

// // Route to delete a flyer by ID
// router.put('/body/:id', async (req, res) => {
//     try {
//       const bodyId = req.params.id; // Extract ID from the URL
//       const updatedData = req.body; // Data to update the FAQ
  
//       // Find the FAQ by ID and update it with the provided data
//       const updatedFAQ = await FAQ.findByIdAndUpdate(bodyId, updatedData, { new: true });
  
//       if (!updatedFAQ) {
//         return res.status(404).json({ message: 'FAQ not found.' });
//       }
  
//       res.status(200).json({ message: 'FAQ updated successfully.', faq: updatedFAQ });
//     } catch (error) {
//       res.status(500).json({ message: 'Failed to update FAQ.', error });
//     }
//   });
  

// module.exports = router;
