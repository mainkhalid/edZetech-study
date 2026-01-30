const express = require('express');
const router = express.Router();
const {
  getAllFaqs,
  getAllFaqsAdmin,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq
} = require('../controllers/faqController');

// Public routes
router.get('/', getAllFaqs);
router.get('/:id', getFaqById);

// Admin routes (add authentication middleware as needed)
// Example: router.use(authenticate, authorizeAdmin);
router.get('/admin/all', getAllFaqsAdmin);
router.post('/', createFaq);
router.put('/:id', updateFaq);
router.delete('/:id', deleteFaq);

module.exports = router;