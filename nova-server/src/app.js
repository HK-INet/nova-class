require('dotenv').config();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');

const db = require('./config/db');

const app = new Koa();
const router = new Router();

// 引入路由模块
const studentRoutes = require('./routes/studentRote');

// 全局中间件
app.use(bodyParser());

// 挂载路由
router.use('/students', studentRoutes.routes());
app.use(router.routes()).use(router.allowedMethods());

// 错误处理
app.on('error', (err, ctx) => {
    console.error('Server error', err, ctx);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
