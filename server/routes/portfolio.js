const router = require('express').Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/portfolio
// @desc    Get user portfolio
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.portfolio);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/portfolio
// @desc    Update/Initialize user portfolio
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { portfolio } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.portfolio = portfolio;
    await user.save();
    res.json(user.portfolio);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
