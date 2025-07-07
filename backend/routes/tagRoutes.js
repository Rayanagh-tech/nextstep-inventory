const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getTagWithCount,
  assignTagToEntity
} = require('../controllers/tagController');

// Middleware
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// 🔐 Require authentication on all tag routes
router.use(auth);

/**
 * @route   GET /api/tags
 * @desc    Get all tags
 * @access  Admin only
 */
router.get('/', getAllTags);

/**
 * @route   POST /api/tags
 * @desc    Create a new tag
 * @access  Admin only
 */
router.post('/', role(['admin']), createTag);

/**
 * @route   PUT /api/tags/:id
 * @desc    Update a tag
 * @access  Admin only
 */
router.put('/:id', role(['admin']), updateTag);

/**
 * @route   DELETE /api/tags/:id
 * @desc    Delete a tag
 * @access  Admin only
 */
router.delete('/:id', role(['admin']), deleteTag);

/**
 * @route   GET /api/tags/count
 * @desc    Get tag count
 * @access  Admin only
 */
router.get('/count', getTagWithCount);

/**
 * @route   POST /api/tags/assign
 * @desc    Assign a tag to an entity
 * @access  Admin only
 */
router.post('/assign', assignTagToEntity);

module.exports = router;
