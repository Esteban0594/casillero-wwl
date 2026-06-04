const express = require('express');
const router = express.Router();
const {
  registerUser,
  createAdmin,
  createClient,
  loginUser,
  getMe,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  getStats
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/stats', protect, admin, getStats);
router.post('/create-admin', protect, admin, createAdmin);
router.post('/create-client', protect, admin, createClient);
router.get('/users', protect, admin, getUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/block', protect, admin, blockUser);
router.put('/users/:id/unblock', protect, admin, unblockUser);

module.exports = router;
