const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

/**
 * JWT 验证中间件
 * 1. 从 Header 中提取 token
 * 2. 验证有效性（过期 / 篡改）
 * 3. 将 payload 挂到 ctx.state.user
 */
module.exports = async function jwtAuth(ctx, next) {
    const authHeader = ctx.get('Authorization') || '';
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        // 没有 token，直接 401
        ctx.status = 401;
        return ctx.body = { code: 401, msg: '未登陆或登陆过期' };
    }

    const token = parts[1];
    try {
        const payload = jwt.verify(token, secret);
        // console.log(payload);

        // payload 中应该包含用户 id 和角色等字段
        // 例如：
        // {
        //      id: '6814c63c8fdd095dafca61ba',
        //      name: '2024028123',
        //      role: 'student',
        //      iat: 1746241556,
        //      exp: 1746500756
        // }
        ctx.state.user = payload;
        await next();
    } catch (err) {
        ctx.status = 401;
        ctx.body = { code: 401, msg: 'Token 验证失败：' + err.message };
    }
};