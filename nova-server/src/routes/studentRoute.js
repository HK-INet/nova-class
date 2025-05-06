const Router = require('koa-router');
const xlsx = require('node-xlsx');
const User = require('../models/User');
const resp = require('../utils/response');
const codes = require('../constants/responseCode');
const auth = require('../middleware/auth');
const path = require('path');

const { createUpload } = require('../middleware/upload');

const router = new Router();

// 配置一个专门用来接收 Excel 的 upload 实例
const excelUpload = createUpload({
    // 你可以指定一个单独目录，也可以复用默认
    dest: path.resolve(__dirname, '../../uploads/studentsExcel'),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (/^application\/(vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|vnd\.ms-excel)$/.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('只允许上传 Excel 文件'));
        }
    }
});

// POST /students/import  批量导入
router.post(
    '/import',
    auth(['admin', 'student']),
    excelUpload.single('file'),
    async (ctx) => {
        try {
            // TODO:后续不用清除mongodb数据库原先的内容，这里只是为了测试文件是否正常上传
            await User.deleteMany({});


            const fileBuffer = ctx.request.file; // 需配合 koa-body 或 koa-multer 处理 multipart
            const workSheets = xlsx.parse(fileBuffer.path);
            const rows = workSheets[0].data;

            if (!ctx.request.file) {
                ctx.status = codes.BAD_REQUEST;
                ctx.body = resp.fail('未收到上传文件');
                return;
            }

            // 找到姓名、班级、学号的列索引
            const header = rows[0].map(c => String(c).trim());
            const nameIndex = header.indexOf('姓名');
            const classIndex = header.indexOf('班级');
            const studentIdIndex = header.indexOf('学号');

            if (nameIndex === -1 || classIndex === -1 || studentIdIndex === -1) {
                ctx.status = codes.BAD_REQUEST;
                ctx.body = resp.fail('表头缺少必要的列：姓名、班级、学号');
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
                    uid: studentId,
                    studentId: studentId,
                    name: studentId,
                    className: className,
                    nickname: name,
                    password: '123456'
                };
            });

            /**
             * 去重
             */
            // 1) 先根据学号去重
            const ids = students.map(s => s.studentId);
            // 2) 查出已存在的
            const existing = await User.find({
                studentId: { $in: ids }
            }, 'studentId').lean();

            const existingIds = new Set(existing.map(e => e.studentId));
            // 3) 过滤掉重复的
            const toInsert = students.filter(s => !existingIds.has(s.studentId));

            if (toInsert.length === 0) {
                ctx.status = codes.SUCCESS;
                ctx.body = resp.success('没有新的学号可导入，全部已存在', {
                    insertedCount: 0,
                    skippedCount: students.length,
                    // duplicates: Array.from(existingIds)
                });
                return;
            }

            await User.insertMany(students, { ordered: false, lean: true });

            ctx.status = codes.SUCCESS;
            ctx.body = resp.success(
                existingIds.size === 0
                    ? '导入成功'
                    : '部分导入成功，存在重复学号',
                {
                    insertedCount: toInsert.length,
                    skippedCount: students.length - toInsert.length,
                    duplicates: Array.from(existingIds)
                }
            );
        } catch (err) {
            ctx.status = codes.ERROR;
            ctx.body = resp.fail('导入异常', err.message);
        } finally {
            // TODO:后续不用删除临时文件，这里就是为了测试文件是否正常上传
            if (!ctx.request.file) {
                const fs = require('fs');
                fs.unlink(ctx.request.file.path, (err) => {
                    if (err) {
                        console.error('删除临时文件失败:', err);
                    }
                });
            }
        }
    });

module.exports = router;
