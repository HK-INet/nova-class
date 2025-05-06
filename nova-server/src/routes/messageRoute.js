const Router = require('koa-router');
const auth = require('../middleware/auth');
const ChatMessage = require('../models/ChatMessage');
const { createUpload } = require('../middleware/upload');
const path = require('path');
const ChatSession = require('../models/ChatSession');
const mongoose = require('mongoose');

const router = new Router();

// 专门给图片上传的 upload 实例
const imageUpload = createUpload({
    dest: path.resolve(__dirname, '../../uploads/chat/images'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (/^image\/(jpe?g|png|gif|webp)$/.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('只允许上传图片文件'));
        }
    }
});


/**
 * POST /chat/message/upload
 * 单张图片上传，返回可访问的 URL
 */
router.post(
    '/upload',
    auth(['admin', 'teacher', 'student']),
    imageUpload.single('file'),
    async (ctx) => {
        // multer 已经存好了文件
        const file = ctx.request.file;
        if (!file) {
            return ctx.fail('未收到上传文件');
        }
        const publicUrl = `/uploads/chat/images/${file.filename}`;
        return ctx.success('上传成功', { url: publicUrl });
    }
);

/**
 * POST /chat/message/create
 * body: {
 *   sessionId: String,
 *   blocks: [
 *     { type:'text', content:'hello' },
 *     { type:'code', content:'console.log(1)' },
 *     { type:'image', url:'http://.../xxx.png' }
 *   ]
 * }
 */
router.post(
    '/create',
    auth(['admin', 'teacher', 'student']),
    async (ctx) => {
        const { sessionId, blocks } = ctx.request.body;

        try {
            session = await ChatSession.findById(sessionId);
        } catch (err) {
            console.error(err);
            return ctx.fail('会话不存在');
        }
        if (session.status !== 'open') {
            return ctx.fail('会话未开启，无法发送消息');
        }


        // 简单校验
        if (!sessionId || !Array.isArray(blocks) || !blocks.length) {
            return ctx.fail('参数不合法');
        }
        // 可以再加更细的 blocks 类型校验
        const msg = new ChatMessage({
            sessionId,
            senderId: ctx.state.user.id,
            blocks
        });
        await msg.save();
        return ctx.success('发送成功', msg.getPublicData());
    }
);

/**
 * GET /chat/message/list
 * 多维度查询消息
 *
 * Query Params:
 *   sessionId?      — 只查询此会话
 *   teacherId?      — 查询此老师名下所有会话
 *   dateFrom?       — YYYY-MM-DD
 *   dateTo?         — YYYY-MM-DD
 *   keyword?        — 模糊匹配 blocks.content
 *   page=1          — 页码
 *   pageSize=50     — 每页条数（最大 100）
 *
 * Behavior:
 *   - 忽略 isDeleted=true 的消息
 *   - isRetracted=true 的消息，在返回时把 blocks 重写成 [{type:'text',content:'该消息已撤回'}]
 *   - 默认按 createdAt **升序**（最旧→最新），前端显示最新在最下面
 */
router.get(
    '/list',
    auth(['admin', 'teacher', 'student']),
    async (ctx) => {
        let {
            sessionId,
            teacherId,
            dateFrom,
            dateTo,
            keyword,
            page = 1,
            pageSize = 50
        } = ctx.query;

        // 校验分页
        page = Math.max(parseInt(page, 10), 1);
        pageSize = Math.min(Math.max(parseInt(pageSize, 10), 1), 100);

        // 构造基础 filter
        const filter = { isDeleted: false };

        // session 过滤
        if (sessionId) {
            if (!mongoose.Types.ObjectId.isValid(sessionId)) {
                return ctx.fail('会话 ID 格式不正确');
            }
            filter.sessionId = sessionId;
        }

        // teacherId 过滤 -> 先查出所有该老师的 sessionId 列表
        if (teacherId) {
            if (!mongoose.Types.ObjectId.isValid(teacherId)) {
                return ctx.fail('教师 ID 格式不正确');
            }
            const sessions = await ChatSession.find({ teacherId }, '_id').lean();
            const ids = sessions.map(s => s._id);
            filter.sessionId = { $in: ids };
        }

        // 日期区间过滤
        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) filter.createdAt.$lte = new Date(dateTo + 'T23:59:59');
        }

        // 关键词匹配
        if (keyword) {
            // 在所有 block.content 中模糊搜索
            filter['blocks.content'] = { $regex: keyword, $options: 'i' };
        }

        // 总数
        const total = await ChatMessage.countDocuments(filter);

        // 拉取数据
        const messages = await ChatMessage
            .find(filter)
            .sort({ createdAt: 1 })               // 升序：最旧在前，最新在后
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean();

        // 处理已撤回消息
        const data = messages.map(msg => {
            if (msg.isRetracted) {
                return {
                    ...msg,
                    blocks: [{ type: 'text', content: '该消息已撤回' }]
                };
            }
            return msg;
        });

        return ctx.success('查询成功', {
            page, pageSize, total,
            data
        });
    }
);

module.exports = router;
