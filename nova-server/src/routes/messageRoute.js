const Router = require('koa-router');
const auth = require('../middleware/auth');
const ChatMessage = require('../models/ChatMessage');
const { createUpload } = require('../middleware/upload');
const path = require('path');

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
        return ctx.success('发送成功', msg);
    }
);

module.exports = router;
