const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 记录一次“开”或“关”操作的时间点
const segmentSchema = new Schema({
  action: {
    type: String,
    enum: ['start', 'stop'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSessionSchema = new Schema({
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 用 YYYY‑MM‑DD 字符串标记是哪一天的课堂
  date: {
    type: String,
    required: true
  },
  // 这一节课里所有“start/stop”操作
  segments: [segmentSchema],
  // 当前状态，open 表示正在互动，closed 表示已停止
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'closed'
  }
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
