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

// 验证密码
UserSchema.methods.comparePassword = async function (password) {
    // 直接比较
    return password === this.password;
};

/**
 * 只返回那些非空、非敏感的字段
 */
UserSchema.methods.getPublicFields = function () {
    const obj = this.toObject({ getters: true, versionKey: false });
    // 删除敏感/内部字段
    delete obj.password;
    delete obj._id;           // 如果你不想返回原始 _id
    delete obj.__v;

    // 只保留 value != null && value !== ''
    return Object.entries(obj).reduce((acc, [key, val]) => {
        if (val !== null && val !== undefined && val !== '') {
            acc[key] = val;
        }
        return acc;
    }, {});
};

module.exports = model('User', UserSchema);
