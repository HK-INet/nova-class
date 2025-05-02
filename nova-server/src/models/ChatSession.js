const { Schema, model } = require('mongoose');

const chatSessionSchema = new Schema({
  isActive:  { type: Boolean, default: false },
  startedAt: { type: Date },
  endedAt:   { type: Date },
});

module.exports = model('ChatSession', chatSessionSchema);
