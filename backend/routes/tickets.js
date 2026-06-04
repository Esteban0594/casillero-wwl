const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  addMessage,
  updateStatus,
  verifyPayment,
  generateInvoice,
  getTicketStats,
  deleteTicket
} = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/auth');

router.get('/stats', protect, admin, getTicketStats);
router.get('/', protect, admin, getTickets);
router.get('/:id', protect, admin, getTicketById);
router.post('/', protect, admin, createTicket);
router.put('/:id', protect, admin, updateTicket);
router.post('/:id/message', protect, admin, addMessage);
router.put('/:id/status', protect, admin, updateStatus);
router.put('/:id/verify-payment', protect, admin, verifyPayment);
router.post('/:id/generate-invoice', protect, admin, generateInvoice);
router.delete('/:id', protect, admin, deleteTicket);

module.exports = router;
