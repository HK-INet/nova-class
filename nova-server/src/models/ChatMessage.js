const { Schema, model } = require('mongoose');

const chatMessageSchema = new Schema({
  session:     { type: Schema.Types.ObjectId, ref: 'ChatSession', required: true },
  student:     { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  content:     { type: String, required: true },
  isDeleted:   { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now },
});

module.exports = model('ChatMessage', chatMessageSchema);
