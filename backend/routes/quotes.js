const express = require('express');
const router = express.Router();
const {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  convertToInvoice,
  updateStatus,
  deleteQuote
} = require('../controllers/quoteController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, admin, getQuotes);
router.get('/:id', protect, admin, getQuoteById);
router.post('/', protect, admin, createQuote);
router.put('/:id', protect, admin, updateQuote);
router.put('/:id/status', protect, admin, updateStatus);
router.post('/:id/convert', protect, admin, convertToInvoice);
router.delete('/:id', protect, admin, deleteQuote);

module.exports = router;
