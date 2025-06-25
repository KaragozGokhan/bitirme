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

/**
 * @swagger
 * /api/admin/add-book:
 *   post:
 *     summary: Yeni kitap ekle (sadece admin)
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
 *               cover_image_url:
 *                 type: string
 *               pdf_url:
 *                 type: string
 *               audio_url:
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
 *                   $ref: '#/components/schemas/Book'
 *       401:
 *         description: Geçersiz veya eksik token
 *       403:
 *         description: Admin yetkisi yok
 */
router.post('/add-book', adminAuth, async (req, res) => {
  try {
    const { title, author, description, cover_image_url, pdf_url, audio_url, price } = req.body;
    
    const result = await pool.query(
      'INSERT INTO books (title, author, description, cover_image_url, pdf_url, audio_url, price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, author, description, cover_image_url, pdf_url, audio_url, price]
    );
    
    res.status(201).json({ message: 'Kitap başarıyla eklendi', book: result.rows[0] });
  } catch (error) {
    console.error('Kitap ekleme hatası:', error);
    res.status(500).json({ error: 'Kitap eklenemedi', details: error.message });
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
    const commentsQuery = await pool.query(`
      SELECT 
        c.*,
        u.username,
        b.title as book_title,
        b.author as book_author
      FROM comments c 
      JOIN users u ON c.user_id = u.id 
      LEFT JOIN books b ON c.book_id = b.id 
      ORDER BY c.created_at DESC
    `);
    res.json(commentsQuery.rows);
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/comments/{id}:
 *   delete:
 *     summary: Yorum sil (sadece admin)
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
 *         description: Yorum başarıyla silindi
 *       404:
 *         description: Yorum bulunamadı
 *       401:
 *         description: Geçersiz veya eksik token
 *       403:
 *         description: Admin yetkisi yok
 */
router.delete('/comments/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQuery = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING *', [id]);
    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Yorum bulunamadı' });
    }
    res.json({ message: 'Yorum başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Tüm kullanıcıları listele (sadece admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Geçersiz veya eksik token
 *       403:
 *         description: Admin yetkisi yok
 */
router.get('/users', adminAuth, async (req, res) => {
  try {
    const usersQuery = await pool.query('SELECT id, username, email, created_at, subscription_type, subscription_end_date FROM users ORDER BY created_at DESC');
    res.json(usersQuery.rows);
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Kullanıcı güncelle (sadece admin)
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
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               subscription_type:
 *                 type: string
 *               subscription_end_date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla güncellendi
 *       404:
 *         description: Kullanıcı bulunamadı
 *       401:
 *         description: Geçersiz veya eksik token
 *       403:
 *         description: Admin yetkisi yok
 */
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, subscription_type, subscription_end_date } = req.body;
    const updateQuery = await pool.query(
      'UPDATE users SET username = $1, email = $2, subscription_type = $3, subscription_end_date = $4 WHERE id = $5 RETURNING id, username, email, created_at, subscription_type, subscription_end_date',
      [username, email, subscription_type, subscription_end_date, id]
    );
    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    res.json(updateQuery.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Kullanıcı sil (sadece admin)
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
 *         description: Kullanıcı başarıyla silindi
 *       404:
 *         description: Kullanıcı bulunamadı
 *       401:
 *         description: Geçersiz veya eksik token
 *       403:
 *         description: Admin yetkisi yok
 */
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQuery = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    res.json({ message: 'Kullanıcı başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/subscriptions:
 *   get:
 *     summary: Tüm abonelikleri listele (sadece admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Abonelik listesi
 *       401:
 *         description: Geçersiz veya eksik token
 *       403:
 *         description: Admin yetkisi yok
 */
router.get('/subscriptions', adminAuth, async (req, res) => {
  try {
    const subscriptionsQuery = await pool.query(`
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.subscription_type, 
        u.subscription_end_date, 
        u.created_at,
        CASE 
          WHEN u.subscription_end_date IS NULL THEN 'Aktif Değil'
          WHEN u.subscription_end_date > NOW() THEN 'Aktif'
          ELSE 'Süresi Dolmuş'
        END as status
      FROM users u 
      ORDER BY u.created_at DESC
    `);
    res.json(subscriptionsQuery.rows);
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/users/{id}/subscription:
 *   put:
 *     summary: Kullanıcı aboneliğini güncelle (sadece admin)
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
 *             properties:
 *               subscription_type:
 *                 type: string
 *               months:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Abonelik başarıyla güncellendi
 *       404:
 *         description: Kullanıcı bulunamadı
 *       401:
 *         description: Geçersiz veya eksik token
 *       403:
 *         description: Admin yetkisi yok
 */
router.put('/users/:id/subscription', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { subscription_type, months } = req.body;
    
    let subscription_end_date = null;
    if (subscription_type === 'premium' && months) {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);
      subscription_end_date = endDate.toISOString();
    }
    
    const updateQuery = await pool.query(
      'UPDATE users SET subscription_type = $1, subscription_end_date = $2 WHERE id = $3 RETURNING id, username, email, subscription_type, subscription_end_date',
      [subscription_type, subscription_end_date, id]
    );
    
    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    res.json(updateQuery.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Dashboard istatistikleri (sadece admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard istatistikleri
 *       401:
 *         description: Geçersiz veya eksik token
 *       403:
 *         description: Admin yetkisi yok
 */
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [
      totalUsersResult,
      totalBooksResult,
      totalCommentsResult,
      allPremiumUsersResult,
      activePremiumUsersResult,
      recentUsersResult
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT COUNT(*) as count FROM books'),
      pool.query('SELECT COUNT(*) as count FROM comments'),
      pool.query("SELECT COUNT(*) as count FROM users WHERE subscription_type = 'premium'"),
      pool.query("SELECT COUNT(*) as count FROM users WHERE subscription_type = 'premium' AND (subscription_end_date IS NULL OR subscription_end_date > NOW())"),
      pool.query('SELECT COUNT(*) as count FROM users WHERE created_at > NOW() - INTERVAL \'30 days\'')
    ]);

    const stats = {
      totalUsers: parseInt(totalUsersResult.rows[0].count),
      totalBooks: parseInt(totalBooksResult.rows[0].count),
      totalComments: parseInt(totalCommentsResult.rows[0].count),
      premiumUsers: parseInt(allPremiumUsersResult.rows[0].count),
      activePremiumUsers: parseInt(activePremiumUsersResult.rows[0].count),
      recentUsers: parseInt(recentUsersResult.rows[0].count)
    };

    res.json(stats);
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