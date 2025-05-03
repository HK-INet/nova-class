// src/middleware/response.js
const resp = require('../utils/response');
const codes = require('../constants/responseCode');

module.exports = async (ctx, next) => {
    /**
     * 快捷成功返回
     * @param {string} message 
     * @param {any}    data    
     */
    ctx.success = (message = '操作成功', data = {}) => {
        ctx.status = 200;                      // HTTP 层面仍可保持 200
        ctx.body = resp.success(message, data);
        return;                                // 方便写： return ctx.success(...)
    };

    /**
     * 快捷失败返回
     * @param {string} message 
     * @param {any}    error   
     */
    ctx.fail = (message = '操作失败', error = '') => {
        // 这里 HTTP 层面也可以自定义，比如 400/500
        ctx.status = codes.ERROR;
        ctx.body = resp.fail(message, error);
        return;                                // 方便写： return ctx.fail(...)
    };

    await next();
};
