const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret, expiresIn } = require('../config/jwt');
const resp = require('../utils/response');

const router = new Router();

// POST /auth/login
router.post('/login', async ctx => {
    const { name, password } = ctx.request.body;
    if (!name || !password) {
        ctx.body = resp.fail('用户名和密码均为必填');
        return;
    }

    // 查找用户
    const user = await User.findOne({ name });
    if (!user) {
        ctx.body = resp.fail('用户不存在或密码错误');
        return;
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        ctx.body = resp.fail('用户不存在或密码错误');
        return;
    }

    // 签发 JWT
    const payload = { id: user._id, name: user.name, role: user.role };
    const token = jwt.sign(payload, secret, { expiresIn });

    // 返回给前端
    ctx.body = resp.success('登录成功', {
        token: token,
        expiresIn: expiresIn,
        user: {
            id: user._id,
            name: user.name,
            role: user.role
        }
    });
});

module.exports = router;