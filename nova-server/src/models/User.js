const mongoose = require('mongoose');
const { model } = mongoose;

const UserSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nickname: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

    // 角色
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student',
        required: true,
    },

    // 仅当 role==='student' 时才有意义
    className: { type: String },
    studentId: { type: String, unique: true },
}, {
    versionKey: false,
});

module.exports = model('User', UserSchema);
