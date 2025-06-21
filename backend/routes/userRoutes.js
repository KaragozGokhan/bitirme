const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const jwt = require('jsonwebtoken');
const { authenticateToken, requireAdminOrSelf } = require('../middleware/auth');
const bcrypt = require('bcrypt');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         subscription_type:
 *           type: string
 *         subscription_end_date:
 *           type: string
 *           format: date-time
 *         created_at:
 *           type: string
 *           format: date-time
 *     UserRental:
 *       type: object
 *       properties:
 *         rental_id:
 *           type: integer
 *         rental_date:
 *           type: string
 *           format: date-time
 *         return_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *         book_id:
 *           type: integer
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         cover_image_url:
 *           type: string
 *     UserReadingHistory:
 *       type: object
 *       properties:
 *         history_id:
 *           type: integer
 *         last_page:
 *           type: integer
 *         last_read:
 *           type: string
 *           format: date-time
 *         book_id:
 *           type: integer
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         cover_image_url:
 *           type: string
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Tüm kullanıcıları listele
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Kullanıcı listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res) => {
  try {
    const usersQuery = await pool.query('SELECT id, first_name, last_name, email, role, subscription_type, subscription_end_date, created_at FROM users');
    res.json(usersQuery.rows);
  } catch (error) {
    console.error('Kullanıcıları getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Mevcut kullanıcının profilini getir
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı profili
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Yetkilendirme hatası
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userQuery = await pool.query(
      'SELECT id, first_name, last_name, email, role, subscription_type, subscription_end_date, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    res.json(userQuery.rows[0]);
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/users/rentals:
 *   get:
 *     summary: Mevcut kullanıcının kiraladığı kitapları getir
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kiralama listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserRental'
 */
router.get('/rentals', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const rentalsQuery = await pool.query(
      `SELECT r.id as rental_id, r.rental_date, r.return_date, r.status,
        b.id as book_id, b.title, b.author, b.cover_image_url
        FROM rentals r
        JOIN books b ON r.book_id = b.id
        WHERE r.user_id = $1 ORDER BY r.rental_date DESC`,
      [userId]
    );
    
    res.json(rentalsQuery.rows);
  } catch (error) {
    console.error('Kiralama getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/users/reading-history:
 *   get:
 *     summary: Mevcut kullanıcının okuma geçmişini getir
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Okuma geçmişi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReadingHistory'
 */
router.get('/reading-history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const historyQuery = await pool.query(
      `SELECT rh.id, rh.last_page, rh.last_read,
        b.id as book_id, b.title, b.author, b.cover_image_url
        FROM reading_history rh
        JOIN books b ON rh.book_id = b.id
        WHERE rh.user_id = $1 ORDER BY rh.last_read DESC`,
      [userId]
    );
    
    res.json(historyQuery.rows);
  } catch (error) {
    console.error('Okuma geçmişi getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: ID'ye göre kullanıcı getir
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.get('/:id', authenticateToken, requireAdminOrSelf, async (req, res) => {
  try {
    const { id } = req.params;
    const userQuery = await pool.query(
      'SELECT id, first_name, last_name, email, role, subscription_type, subscription_end_date, created_at FROM users WHERE id = $1',
      [id]
    );
    
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    res.json(userQuery.rows[0]);
  } catch (error) {
    console.error('Kullanıcı getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Yeni kullanıcı oluştur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password_hash
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password_hash:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, password_hash } = req.body;
    
    const newUserQuery = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email, role, subscription_type, subscription_end_date, created_at',
      [first_name, last_name, email, password_hash]
    );
    
    res.status(201).json(newUserQuery.rows[0]);
  } catch (error) {
    console.error('Kullanıcı oluşturma hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Kullanıcı güncelle
 *     tags: [Users]
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
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password_hash:
 *                 type: string
 *               subscription_type:
 *                 type: string
 *               subscription_end_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, password_hash, subscription_type, subscription_end_date } = req.body;
    
    const updateQuery = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, email = $3, password_hash = $4, subscription_type = $5, subscription_end_date = $6 WHERE id = $7 RETURNING id, first_name, last_name, email, role, subscription_type, subscription_end_date, created_at',
      [first_name, last_name, email, password_hash, subscription_type, subscription_end_date, id]
    );
    
    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    res.json(updateQuery.rows[0]);
  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Kullanıcı sil
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla silindi
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleteQuery = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    
    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    res.json({ message: 'Kullanıcı başarıyla silindi' });
  } catch (error) {
    console.error('Kullanıcı silme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/users/{id}/rentals:
 *   get:
 *     summary: Kullanıcının kiraladığı kitapları getir
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kiralama listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserRental'
 */
router.get('/:id/rentals', async (req, res) => {
  try {
    const { id } = req.params;
    const rentalsQuery = await pool.query(
      `SELECT r.id as rental_id, r.rental_date, r.return_date, r.status,
        b.id as book_id, b.title, b.author, b.cover_image_url
        FROM rentals r
        JOIN books b ON r.book_id = b.id
        WHERE r.user_id = $1 ORDER BY r.rental_date DESC`,
      [id]
    );

    res.json(rentalsQuery.rows);
  } catch (error) {
    console.error('Kiralama getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/users/{id}/reading-history:
 *   get:
 *     summary: Kullanıcının okuma geçmişini getir
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Okuma geçmişi listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserReadingHistory'
 */
router.get('/:id/reading-history', async (req, res) => {
  try {
    const { id } = req.params;
    const historyQuery = await pool.query(
      `SELECT rh.id as history_id, rh.last_page, rh.last_read,
        b.id as book_id, b.title, b.author, b.cover_image_url
        FROM reading_history rh
        JOIN books b ON rh.book_id = b.id
        WHERE rh.user_id = $1 ORDER BY rh.last_read DESC`,
      [id]
    );

    res.json(historyQuery.rows);
  } catch (error) {
    console.error('Okuma geçmişi hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/users/{id}/subscription:
 *   put:
 *     summary: Kullanıcı aboneliğini güncelle
 *     tags: [Users]
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
 *               - subscription_type
 *               - months
 *             properties:
 *               subscription_type:
 *                 type: string
 *               months:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Abonelik başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.put('/:id/subscription', async (req, res) => {
  try {
    const { id } = req.params;
    const { subscription_type, months } = req.body;
    
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + parseInt(months));
    
    const updateQuery = await pool.query(
      'UPDATE users SET subscription_type = $1, subscription_end_date = $2 WHERE id = $3 RETURNING id, first_name, last_name, email, role, subscription_type, subscription_end_date, created_at',
      [subscription_type, endDate, id]
    );
    
    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    res.json(updateQuery.rows[0]);
  } catch (error) {
    console.error('Abonelik güncelleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router; 