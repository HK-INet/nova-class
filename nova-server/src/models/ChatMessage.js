const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockSchema = new Schema({
  type: {
    type: String,
    enum: ['text', 'code', 'image', 'video'],
    required: true
  },
  content: String,    // 用于 text / code
  url: String         // 用于 image / video
}, { _id: false });

const chatMessageSchema = new Schema({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: 'ChatSession',
    required: true
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blocks: {
    type: [blockSchema],
    validate: blocks => blocks.length > 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isRetracted: {
    type: Boolean,
    default: false
  },
  retractedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);