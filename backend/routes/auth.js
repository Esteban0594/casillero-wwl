const express = require('express');
const router = express.Router();
const {
  registerUser,
  createAdmin,
  loginUser,
  getMe,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getStats
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/stats', protect, admin, getStats);
router.post('/create-admin', protect, admin, createAdmin);
router.get('/users', protect, admin, getUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
