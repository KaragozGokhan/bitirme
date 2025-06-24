const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Admin JWT doğrulama middleware'i
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme token\'ı bulunamadı' });
    }
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    if (!decoded.isAdmin || !decoded.email) {
      return res.status(403).json({ error: 'Admin yetkisi yok' });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Geçersiz admin token' });
  }
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminQuery = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (adminQuery.rows.length === 0) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
    }
    const admin = adminQuery.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
    }
    // Admin JWT oluştur
    const token = jwt.sign(
      { id: admin.id, email: admin.email, isAdmin: true },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({
      message: 'Admin giriş başarılı',
      admin: { id: admin.id, email: admin.email, username: admin.username, role: admin.role },
      token
    });
  } catch (error) {
    console.error('Admin giriş hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Sadece adminlerin erişebileceği örnek endpoint
router.get('/dashboard', adminAuth, (req, res) => {
  res.json({ message: 'Admin dashboarduna hoş geldiniz', admin: req.admin });
});

// Admin kitap ekleme örneği
router.post('/add-book', adminAuth, async (req, res) => {
  try {
    const { title, author, description, price } = req.body;
    const result = await pool.query(
      'INSERT INTO books (title, author, description, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, author, description, price]
    );
    res.status(201).json({ message: 'Kitap eklendi', book: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Kitap eklenemedi' });
  }
});

/**
 * @swagger
 * /api/admin/books:
 *   get:
 *     summary: Tüm kitapları listele (sadece admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kitap listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       401:
 *         description: Geçersiz veya eksik token
 *       403:
 *         description: Admin yetkisi yok
 */
router.get('/books', adminAuth, async (req, res) => {
  try {
    const booksQuery = await pool.query('SELECT * FROM books ORDER BY title');
    res.json(booksQuery.rows);
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/books/{id}:
 *   put:
 *     summary: Kitap güncelle (sadece admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               cover_image_url:
 *                 type: string
 *               pdf_url:
 *                 type: string
 *               audio_url:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Kitap başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Kitap bulunamadı
 *       401:
 *         description: Geçersiz veya eksik token
 *       403:
 *         description: Admin yetkisi yok
 */
router.put('/books/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, cover_image_url, pdf_url, audio_url, price } = req.body;
    const updateQuery = await pool.query(
      'UPDATE books SET title = $1, author = $2, description = $3, cover_image_url = $4, pdf_url = $5, audio_url = $6, price = $7 WHERE id = $8 RETURNING *',
      [title, author, description, cover_image_url, pdf_url, audio_url, price, id]
    );
    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kitap bulunamadı' });
    }
    res.json(updateQuery.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/books/{id}:
 *   delete:
 *     summary: Kitap sil (sadece admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kitap başarıyla silindi
 *       404:
 *         description: Kitap bulunamadı
 *       401:
 *         description: Geçersiz veya eksik token
 *       403:
 *         description: Admin yetkisi yok
 */
router.delete('/books/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQuery = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kitap bulunamadı' });
    }
    res.json({ message: 'Kitap başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/comments:
 *   get:
 *     summary: Tüm yorumları listele (sadece admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Yorum listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   comment:
 *                     type: string
 *                   book_id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   rate:
 *                     type: integer
 *       401:
 *         description: Geçersiz veya eksik token
 *       403:
 *         description: Admin yetkisi yok
 */
router.get('/comments', adminAuth, async (req, res) => {
  try {
    const commentsQuery = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
    res.json(commentsQuery.rows);
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin işlemleri
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin girişi
 *     tags: [Admin]
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
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Geçersiz kimlik bilgileri
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Admin dashboarduna erişim (sadece admin JWT ile)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı erişim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     isAdmin:
 *                       type: boolean
 *       401:
 *         description: Geçersiz veya eksik token
 *       403:
 *         description: Admin yetkisi yok
 */

/**
 * @swagger
 * /api/admin/add-book:
 *   post:
 *     summary: Admin tarafından kitap ekleme (sadece admin JWT ile)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Kitap başarıyla eklendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 book:
 *                   type: object
 *       401:
 *         description: Geçersiz veya eksik token
 *       403:
 *         description: Admin yetkisi yok
 *       500:
 *         description: Kitap eklenemedi
 */

module.exports = router; 