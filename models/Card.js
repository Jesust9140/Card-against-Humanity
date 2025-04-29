const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  text: String,
  type: { type: String, enum: ['white', 'black'] }
});

module.exports = mongoose.model('Card', CardSchema);
