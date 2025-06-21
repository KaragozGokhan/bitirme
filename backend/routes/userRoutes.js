const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

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
router.get('/', auth, async (req, res) => {
  try {
    const usersQuery = await pool.query('SELECT id, username, email, subscription_type, subscription_end_date, created_at FROM users');
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
 *     responses:
 *       200:
 *         description: Kullanıcı profil bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Yetkilendirme hatası
 */
router.get('/profile', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    // req.user zaten auth middleware'inde veritabanından çekilmiş kullanıcıyı içeriyor
    const { id, username, email, subscription_type, subscription_end_date, created_at } = req.user;
    res.json({ id, username, email, subscription_type, subscription_end_date, created_at });
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/users/my-books:
 *   get:
 *     summary: Mevcut kullanıcının kiraladığı kitapları getir
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Kullanıcının kiraladığı kitaplar
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserRental'
 */
router.get('/my-books', auth, async (req, res) => {
  try {
    // Şimdilik test için user ID = 1 kullanıyoruz
    // Gerçek uygulamada authentication token'dan alınacak
    const sampleUserId = 1;
    
    const rentalsQuery = await pool.query(
      `SELECT r.id as rental_id, r.rental_date, r.return_date, r.status,
        b.id as book_id, b.title, b.author, b.cover_image_url, b.audio_url,
        b.description, b.price
        FROM rentals r
        JOIN books b ON r.book_id = b.id
        WHERE r.user_id = $1 AND r.status = 'active'
        ORDER BY r.rental_date DESC`,
      [sampleUserId]
    );

    res.json(rentalsQuery.rows);
  } catch (error) {
    console.error('Kullanıcı kitapları getirme hatası:', error);
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
 *     responses:
 *       200:
 *         description: Kullanıcı detayları
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userQuery = await pool.query(
      'SELECT id, username, email, subscription_type, subscription_end_date, created_at FROM users WHERE id = $1',
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
 *               - username
 *               - email
 *               - password_hash
 *             properties:
 *               username:
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
router.post('/', auth, async (req, res) => {
  try {
    const { username, email, password_hash } = req.body;
    
    const newUserQuery = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, subscription_type, subscription_end_date, created_at',
      [username, email, password_hash]
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
 *               username:
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
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password_hash, subscription_type, subscription_end_date } = req.body;
    
    const updateQuery = await pool.query(
      'UPDATE users SET username = $1, email = $2, password_hash = $3, subscription_type = $4, subscription_end_date = $5 WHERE id = $6 RETURNING id, username, email, subscription_type, subscription_end_date, created_at',
      [username, email, password_hash, subscription_type, subscription_end_date, id]
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
router.delete('/:id', auth, async (req, res) => {
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
router.get('/:id/rentals', auth, async (req, res) => {
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
router.get('/:id/reading-history', auth, async (req, res) => {
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
router.put('/:id/subscription', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { subscription_type, months } = req.body;
    
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + parseInt(months));
    
    const updateQuery = await pool.query(
      'UPDATE users SET subscription_type = $1, subscription_end_date = $2 WHERE id = $3 RETURNING id, username, email, subscription_type, subscription_end_date, created_at',
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