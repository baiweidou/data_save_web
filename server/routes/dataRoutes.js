const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const Data = require('../models/Data');

// 配置文件上传
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 限制5MB
});

// 获取所有数据
router.get('/data', async (req, res) => {
  try {
    const data = await Data.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 上传数据（手机号和二维码）
router.post('/data', upload.single('qrCodeImage'), async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    // 验证手机号
    if (!phoneNumber || !/^1[3-9]\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ message: '请提供有效的手机号码' });
    }

    let qrCodePath;
    
    // 如果上传了二维码图片
    if (req.file) {
      qrCodePath = `/uploads/${req.file.filename}`;
    } 
    // 如果没有上传图片，则根据手机号生成二维码
    else {
      const qrCodeFilename = `${Date.now()}.png`;
      const qrCodeFullPath = path.join(__dirname, '../../public/uploads', qrCodeFilename);
      
      // 确保目录存在
      const uploadDir = path.join(__dirname, '../../public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // 生成二维码
      await QRCode.toFile(qrCodeFullPath, phoneNumber);
      qrCodePath = `/uploads/${qrCodeFilename}`;
    }

    // 检查手机号是否已存在
    const existingData = await Data.findOne({ phoneNumber });
    if (existingData) {
      // 更新现有记录
      existingData.qrCodeImage = qrCodePath;
      await existingData.save();
      return res.status(200).json(existingData);
    }

    // 创建新记录
    const newData = new Data({
      phoneNumber,
      qrCodeImage: qrCodePath
    });

    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 删除数据
router.delete('/data/:id', async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: '数据不存在' });
    }

    // 删除关联的图片文件
    if (data.qrCodeImage) {
      const imagePath = path.join(__dirname, '../../public', data.qrCodeImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Data.findByIdAndDelete(req.params.id);
    res.json({ message: '数据已删除' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 