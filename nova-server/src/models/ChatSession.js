const mongoose = require('mongoose');

const ChatSessionSchema = new mongoose.Schema({
  // 当前会话是否开启
  isOpen: {
    type: Boolean,
    default: false,
  },
  // 会话开启时间
  startedAt: {
    type: Date,
    default: Date.now,
  },
  // 会话关闭时间
  endedAt: {
    type: Date,
  },
  // 可拓展：哪个教师开启的
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'assistant', 'student'],
    required: true
  }
}, {
  versionKey: false,
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
