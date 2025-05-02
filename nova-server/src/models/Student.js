const { Schema, model } = require('mongoose');

const studentSchema = new Schema({
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    className: { type: String },
    nickname: { type: String },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = model('Student', studentSchema);
