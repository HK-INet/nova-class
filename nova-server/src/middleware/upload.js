// nova-server/src/middleware/upload.js
const multer = require('@koa/multer');
const path = require('path');
const fs = require('fs');

// 确保 uploads 目录存在
const defaultUploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(defaultUploadDir)) fs.mkdirSync(defaultUploadDir, { recursive: true });

/**
 * 创建一个可配置的 multer 实例
 * @param {Object} options
 * @param {string} [options.dest] - 上传目录，默认 uploads
 * @param {Object} [options.limits] - 限制配置，如 { fileSize: 5 * 1024 * 1024 }
 * @param {Function} [options.fileFilter] - 文件过滤函数 (req, file, cb)
 * @returns multer instance
 */
function createUpload({ dest = defaultUploadDir, limits = {}, fileFilter } = {}) {
    // 确保目录存在
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, dest),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
            const timestamp = Date.now();
            cb(null, `${baseName}-${timestamp}${ext}`);
        }
    });

    const opts = { storage };
    if (limits) opts.limits = limits;
    if (fileFilter) opts.fileFilter = fileFilter;

    return multer(opts);
}

module.exports = { createUpload };