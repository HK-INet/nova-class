const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

module.exports = async (ctx, next) => {
    const authHeader = ctx.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ctx.fail('未登陆，请先登陆');
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, secret);
        ctx.state.user = decoded;
        await next();
    } catch (err) {
        return ctx.fail('令牌无效或已过期');
    }
};