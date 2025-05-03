const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret, expiresIn } = require('../config/jwt');

const router = new Router();

// POST /auth/login
router.post('/login', async ctx => {
    const { name, password } = ctx.request.body;
    if (!name || !password) {
        return ctx.fail('用户名和密码均为必填');
    }

    // 查找用户
    const user = await User.findOne({ name });
    if (!user) {
        return ctx.fail('用户不存在或密码错误');
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return ctx.fail('用户不存在或密码错误');
    }

    // 签发 JWT
    const payload = { id: user._id, name: user.name, role: user.role };
    const token = jwt.sign(payload, secret, { expiresIn });

    // 返回给前端
    return ctx.success('登录成功', {
        token: token,
        expiresIn: expiresIn,
        user: userinfo = user.getPublicFields(),
    });
});

module.exports = router;