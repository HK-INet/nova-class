const codes = require('../constants/responseCode');

/**
 * 构造标准 API 响应
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