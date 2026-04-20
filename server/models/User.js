const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlist: [
    { type: String }
  ],
  portfolio: [
    {
      coinId: { type: String, required: true },
      amount: { type: Number, required: true, default: 0 }
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);