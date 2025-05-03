const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');
const response = require('../utils/response');

module.exports = async (ctx, next) => {
    const authHeader = ctx.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        ctx.body = response.fail('未登陆，请先登陆');
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, secret);
        ctx.state.user = decoded;
        await next();
    } catch (err) {
        ctx.body = response.fail('令牌无效或已过期');
        return;
    }
};