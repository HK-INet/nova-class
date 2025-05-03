/**
 * 授权中间件：校验用户角色，决定是否放行
 *
 * @param {string | string[]} allowedRoles - 单个或多个允许的角色，例如 'admin' 或 ['admin','teacher']
 * @param {Object} options
 * @param {boolean} [options.allowAnonymous=false] - 是否允许未登录用户访问（如公开接口）
 */
module.exports = function authorize(allowedRoles, options = {}) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const allowAnonymous = options.allowAnonymous === true;

    return async (ctx, next) => {
        const user = ctx.state.user;
        if (!user) {
            if (allowAnonymous) {
                return await next();
            }
            ctx.status = 401;
            return ctx.body = { code: 401, msg: '未登录或登录已过期' };
        }

        if (!roles.includes(user.role)) {
            console.warn(`[权限拒绝] 用户 ${user.name}（角色: ${user.role}）尝试访问`);
            ctx.status = 403;
            return ctx.body = { code: 403, msg: '无权限访问' };
        }

        await next();
    };
};
