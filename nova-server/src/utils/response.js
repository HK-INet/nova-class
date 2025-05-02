const codes = require('../constants/responseCode');

/**
 * 构造标准 API 响应
 * @param {number} code    状态码：200 表示成功，500 失败...
 * @param {string} message 描述信息
 * @param {object} data    成功时的数据载体
 * @param {string} error   失败时的错误详情
 */
function build({ code, message, data = null, error = null }) {
    const res = { code, message };
    if (data !== null) res.data = data;
    if (error !== null) res.error = error;
    return res;
}

module.exports = {
    success(message = '操作成功', data = {}) {
        return build({ code: codes.SUCCESS, message, data });
    },
    fail(message = '操作失败', error = '') {
        return build({ code: codes.ERROR, message, error });
    },
};
