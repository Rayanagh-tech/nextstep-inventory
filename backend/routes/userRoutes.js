const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
  updateMfa,
} = require('../controllers/userController');

// Middleware
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// 🔐 All routes require authentication
router.use(auth);

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 */
router.get('/', role(['admin']), getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by ID (Admin or Self)
 */
router.get('/:id', async (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}, getUserById);

/**
 * @route   POST /api/users
 * @desc    Create a new user (Admin only)
 */
router.post('/', role(['admin']), createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user (Admin or Self)
 */
router.put('/:id', async (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}, updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user (Admin only)
 */
router.delete('/:id', role(['admin']), deleteUser);




/**
 * @route   PUT /api/users/:id/password
 * @desc    Update user password (Admin or Self)
 */
router.put('/:id/password', async (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}, updatePassword);


/**
 * @route   PUT /api/users/:id/mfa
 * @desc    Enable or disable MFA (Admin or Self)
 */
router.put('/:id/mfa', async (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
}, updateMfa);



module.exports = router;
