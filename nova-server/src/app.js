require('dotenv').config();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const mount = require('koa-mount');
const serve = require('koa-static');
const path = require('path');

const app = new Koa();
const router = new Router();

const db = require('./config/db');
const studentRoutes = require('./routes/studentRoute');
const authRoutes = require('./routes/authRoute');
const responseMW = require('./middleware/response');
const jwtAuth = require('./middleware/jwtAuth');
const chatRoutes = require('./routes/chatRoute');
const messageRoutes = require('./routes/messageRoute');

// 全局中间件
app.use(bodyParser());

// 响应中间件
app.use(responseMW);

// JWT 验证中间件
app.use(jwtAuth);

// 挂载登录接口
router.use('/auth', authRoutes.routes(), authRoutes.allowedMethods());

// 挂载学生接口
router.use('/students', studentRoutes.routes(), studentRoutes.allowedMethods());

// 课堂会话接口
router.use('/chat', chatRoutes.routes(), chatRoutes.allowedMethods());

// 课堂消息接口
router.use('/chat/message', messageRoutes.routes(), messageRoutes.allowedMethods());

// 应用路由
app.use(router.routes()).use(router.allowedMethods());

// 错误处理
app.on('error', (err, ctx) => {
    console.error('Server error', err, ctx);
});


// 将本地 /uploads 映射到 URL 前缀 /uploads
// 这样前端访问 http://your-domain.com/uploads/chat/images/xxx.jpg 就能拿到文件
app.use(mount(
    '/uploads',
    serve(path.resolve('./uploads'))
));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
