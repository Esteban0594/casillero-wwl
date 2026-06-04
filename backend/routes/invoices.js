const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  markAsPaid,
  cancelInvoice,
  getInvoiceStats,
  deleteInvoice
} = require('../controllers/invoiceController');
const { protect, admin } = require('../middleware/auth');

router.get('/stats', protect, admin, getInvoiceStats);
router.get('/', protect, admin, getInvoices);
router.get('/:id', protect, admin, getInvoiceById);
router.post('/', protect, admin, createInvoice);
router.put('/:id', protect, admin, updateInvoice);
router.put('/:id/pay', protect, admin, markAsPaid);
router.put('/:id/cancel', protect, admin, cancelInvoice);
router.delete('/:id', protect, admin, deleteInvoice);

module.exports = router;
