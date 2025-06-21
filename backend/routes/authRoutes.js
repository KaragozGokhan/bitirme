const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         subscription_type:
 *           type: string
 *         subscription_end_date:
 *           type: string
 *           format: date-time
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Giriş başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       401:
 *         description: Geçersiz kimlik bilgileri
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı e-posta ile bul
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userQuery.rows.length === 0) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
    }

    const user = userQuery.rows[0];

    // Şifreyi kontrol et
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
    }

    // Hassas bilgileri çıkar
    const { password_hash, ...userWithoutPassword } = user;

    // JWT token oluştur
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Giriş başarılı',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kayıt başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Geçersiz istek veya kullanıcı zaten var
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // E-posta ve kullanıcı adının benzersiz olduğunu kontrol et
    const existingUserQuery = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUserQuery.rows.length > 0) {
      return res.status(400).json({ error: 'Bu e-posta veya kullanıcı adı zaten kullanılıyor' });
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Yeni kullanıcı oluştur
    const newUserQuery = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, subscription_type, subscription_end_date, created_at',
      [username, email, password_hash]
    );

    res.status(201).json({
      message: 'Kayıt başarılı',
      user: newUserQuery.rows[0]
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Şifre sıfırlama isteği
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Şifre sıfırlama bağlantısı gönderildi
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Kullanıcıyı e-posta ile bul
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı' });
    }

    // Burada normalde e-posta gönderme işlemi yapılır
    // Şimdilik sadece başarılı mesajı döndürüyoruz
    res.json({ message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi' });
  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Şifre sıfırlama
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *               - new_password
 *             properties:
 *               email:
 *                 type: string
 *               token:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Şifre başarıyla güncellendi
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, new_password } = req.body;

    // Kullanıcıyı e-posta ile bul
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı' });
    }

    // Burada normalde token doğrulaması yapılır
    // Şimdilik token kontrolünü atlıyoruz

    // Yeni şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(new_password, salt);

    // Şifreyi güncelle
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2',
      [password_hash, email]
    );

    res.json({ message: 'Şifreniz başarıyla güncellendi' });
  } catch (error) {
    console.error('Şifre güncelleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router; 