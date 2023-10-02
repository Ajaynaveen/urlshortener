const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  urlCode: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

module.exports = ShortUrl;
