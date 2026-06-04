const express = require('express');
const router = express.Router();
const {
  getCarriers,
  getCarrierById,
  createCarrier,
  updateCarrier,
  deleteCarrier,
  testCarrierApi,
  getActiveCarriers
} = require('../controllers/carrierController');
const { protect, admin } = require('../middleware/auth');

router.get('/active', protect, getActiveCarriers);
router.get('/', protect, admin, getCarriers);
router.get('/:id', protect, admin, getCarrierById);
router.post('/', protect, admin, createCarrier);
router.put('/:id', protect, admin, updateCarrier);
router.delete('/:id', protect, admin, deleteCarrier);
router.post('/:id/test', protect, admin, testCarrierApi);

module.exports = router;
