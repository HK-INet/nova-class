const Router = require('koa-router');
const ChatSession = require('../models/ChatSession');
const auth = require('../middleware/auth');

// helper：获取今天的 YYYY‑MM‑DD
function getToday() {
    return new Date().toISOString().slice(0, 10);
}

const router = new Router();

/**
 * POST /chat/session/start
 * 开启一次互动（或者在已存在同日记录中插入新的 start 段）
 */
router.post(
    '/session/start',
    auth(['admin', 'teacher', 'student']),
    async (ctx) => {
        const teacherId = ctx.state.user.id;
        const today = getToday();

        let session = await ChatSession.findOne({ teacherId, date: today });
        if (!session) session = new ChatSession({ teacherId, date: today });

        if (session.status === 'open') {
            return ctx.success('会话已经处于打开状态', session);
        }

        session.segments.push({ action: 'start' });
        session.status = 'open';
        await session.save();

        return ctx.success('会话开启成功', session);
    }
);

/**
 * POST /chat/session/stop
 * 关闭本次互动（插入 stop 段，并设为 closed）
 */
router
    .post('/session/stop',
        auth(['admin', 'teacher', 'student']),
        async (ctx) => {
            try {
                const teacherId = ctx.state.user.id;
                const today = getToday();

                const session = await ChatSession.findOne({ teacherId, date: today });
                if (!session) {
                    return res.status(400).json({ code: 400, message: '未找到今日课堂会话记录' });
                }
                if (session.status === 'closed') {
                    return ctx.success('会话已经处于关闭状态', session);
                }
                if (session.segments.length === 0) {
                    return ctx.success('会话没有开始，无法关闭', session);
                }

                session.segments.push({ action: 'stop' });
                session.status = 'closed';
                await session.save();

                return ctx.success('会话关闭成功', session);
            } catch (err) {
                console.error(err);
                return ctx.fail('服务器错误', err);
            }
        });

module.exports = router;
