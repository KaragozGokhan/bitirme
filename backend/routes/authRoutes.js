const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Email ve kullanıcı adının daha önce kullanılıp kullanılmadığını kontrol ediyoruz
    const checkUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2', 
      [email, username]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'Bu email veya kullanıcı adı zaten kullanımda' });
    }

    // Parolayı hashliyoruz
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Kullanıcıyı veritabanına ekliyoruz
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, subscription_type',
      [username, email, hashedPassword]
    );

    // JWT token oluşturuyoruz
    const token = jwt.sign(
      { userId: newUser.rows[0].id }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      token,
      user: {
        id: newUser.rows[0].id,
        username: newUser.rows[0].username,
        email: newUser.rows[0].email,
        subscription_type: newUser.rows[0].subscription_type
      }
    });

  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kullanıcı girişi
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kullanıcıyı email ile buluyoruz
    const userQuery = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(400).json({ error: 'Geçersiz kimlik bilgileri' });
    }

    const user = userQuery.rows[0];

    // Parolayı kontrol ediyoruz
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Geçersiz kimlik bilgileri' });
    }

    // JWT token oluşturuyoruz
    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        subscription_type: user.subscription_type
      }
    });

  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Mevcut kullanıcı bilgilerini getir
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      subscription_type: req.user.subscription_type,
      subscription_end_date: req.user.subscription_end_date
    });
  } catch (error) {
    console.error('Kullanıcı bilgileri hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router; 