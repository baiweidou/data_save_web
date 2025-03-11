const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dataRoutes = require('./server/routes/dataRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 视图引擎设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// 路由
app.use('/api', dataRoutes);

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 连接MongoDB
mongoose.connect('mongodb://localhost:27017/qrcode_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('已连接到MongoDB');
})
.catch(err => {
  console.error('MongoDB连接错误:', err);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 