# 手机号与二维码数据管理系统

这是一个简单的网页应用，用于管理手机号和对应的二维码图片。用户可以上传手机号和二维码图片，或者只提供手机号系统自动生成二维码。

## 技术栈

- **前端**：Vue.js + Element UI
- **后端**：Node.js + Express
- **数据库**：MongoDB

## 功能特点

- 展示手机号和二维码的表格数据
- 支持上传二维码图片或自动生成二维码
- 支持删除数据
- 支持分页显示
- 支持二维码图片预览

## 安装与运行

### 前提条件

- Node.js (v12.0.0 或更高版本)
- MongoDB (v4.0.0 或更高版本)

### 安装步骤

1. 克隆或下载项目代码

2. 安装依赖
   ```
   npm install
   ```

3. 确保MongoDB服务已启动
   ```
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo service mongod start
   ```

4. 启动应用
   ```
   npm start
   ```

5. 访问应用
   在浏览器中访问 `http://localhost:3000`

## API接口

### 获取所有数据
- **URL**: `/api/data`
- **方法**: `GET`
- **响应**: 所有数据的JSON数组

### 添加数据
- **URL**: `/api/data`
- **方法**: `POST`
- **参数**:
  - `phoneNumber`: 手机号码 (必填)
  - `qrCodeImage`: 二维码图片文件 (可选)
- **响应**: 新添加的数据对象

### 删除数据
- **URL**: `/api/data/:id`
- **方法**: `DELETE`
- **参数**: 
  - `id`: 数据ID
- **响应**: 成功消息

## 配置

可以在`server.js`文件中修改以下配置：

- 服务器端口: `PORT`变量
- MongoDB连接: `mongoose.connect`函数的参数

## 许可证

MIT 