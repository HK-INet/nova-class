const Router = require('koa-router');
const xlsx = require('node-xlsx');
const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const upload = require('../middleware/upload');


const router = new Router();

// POST /students/import  批量导入
router.post(
    '/import',
    upload.single('file'), // 使用 multer 中间件处理文件上传
    async (ctx) => {
        try {
            const fileBuffer = ctx.request.file; // 需配合 koa-body 或 koa-multer 处理 multipart
            const workSheets = xlsx.parse(fileBuffer.path);
            const rows = workSheets[0].data;

            // 找到姓名、班级、学号的列索引
            const header = rows[0].map(c => String(c).trim());
            const nameIndex = header.indexOf('姓名');
            const classIndex = header.indexOf('班级');
            const studentIdIndex = header.indexOf('学号');

            if (nameIndex === -1 || classIndex === -1 || studentIdIndex === -1) {
                ctx.status = 400;
                ctx.body = { error: '表格中缺少必要的列：姓名、班级或学号' };
                return;
            }

            // 从第二行开始，过滤掉学号或姓名是空字符串的行
            const dataRows = rows
                .slice(1)
                .filter(row => {
                    const id = String(row[studentIdIndex] || '').trim();
                    const name = String(row[nameIndex] || '').trim();
                    return id !== '' && name !== '';
                });

            const students = dataRows.map((row, i) => {
                const name = String(row[nameIndex] || '').trim();
                const className = String(row[classIndex] || '').trim();
                const studentId = String(row[studentIdIndex] || '').trim();

                return {
                    studentId: studentId,
                    name: name,
                    className: className,
                    nickname: name,
                    password: '123456',
                };
            });

            /**
             * 去重
             */
            // 1) 先根据学号去重
            const ids = students.map(s => s.studentId);
            // 2) 查出已存在的
            const existing = await Student.find({
                studentId: { $in: ids }
            }, 'studentId').lean();

            const existingIds = new Set(existing.map(e => e.studentId));
            // 3) 过滤掉重复的
            const toInsert = students.filter(s => !existingIds.has(s.studentId));

            if (toInsert.length === 0) {
                ctx.status = 409;
                ctx.body = { message: '没有新的学号可导入，全部学号已存在。' };
                return;
            }

            await Student.insertMany(students);
            ctx.body = {
                message: '导入完成',
                insertedCount: toInsert.length,
                skippedCount: students.length - toInsert.length,
                skippedIds: Array.from(existingIds)
            };
        } catch (err) {
            ctx.status = 500;
            ctx.body = { error: err.message };
        }
    });

module.exports = router;
