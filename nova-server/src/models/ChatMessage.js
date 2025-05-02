const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  // 所属会话
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatSession',
    required: true,
  },
  // 发送者——学生或教师
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // 消息内容
  content: {
    type: String,
    required: true,
    trim: true,
  },
  // 时间戳
  sentAt: {
    type: Date,
    default: Date.now,
  },
  // 删除标记（软删除）
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
