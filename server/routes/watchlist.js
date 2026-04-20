const router = require('express').Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/watchlist
// @desc    Get user watchlist IDs
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/watchlist
// @desc    Toggle a coin in user watchlist
// @access  Private
router.put('/', authMiddleware, async (req, res) => {
  const { coinId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const index = user.watchlist.indexOf(coinId);
    
    if (index === -1) {
      user.watchlist.push(coinId);
    } else {
      user.watchlist.splice(index, 1);
    }
    
    await user.save();
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
