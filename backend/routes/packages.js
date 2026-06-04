const express = require('express');
const router = express.Router();
const {
  registerPackage,
  receivedAtMiami,
  updatePackageStatus,
  getMyPackages,
  getAllPackages,
  getPackageById,
  getCarriers,
  deletePackage
} = require('../controllers/packageController');
const { protect, admin } = require('../middleware/auth');

router.get('/carriers', protect, getCarriers);
router.get('/my-packages', protect, getMyPackages);
router.get('/', protect, admin, getAllPackages);
router.get('/:id', protect, getPackageById);
router.post('/', protect, admin, registerPackage);
router.put('/:id/received', protect, admin, receivedAtMiami);
router.put('/:id/status', protect, admin, updatePackageStatus);
router.delete('/:id', protect, admin, deletePackage);

module.exports = router;
