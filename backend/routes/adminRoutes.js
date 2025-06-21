const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const bcrypt = require('bcrypt');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Apply authentication and admin authorization to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminStats:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: integer
 *         totalBooks:
 *           type: integer
 *         totalRentals:
 *           type: integer
 *         activeRentals:
 *           type: integer
 *         overdueRentals:
 *           type: integer
 *         totalRevenue:
 *           type: number
 *         monthlyStats:
 *           type: object
 *           properties:
 *             newUsers:
 *               type: integer
 *             newBooks:
 *               type: integer
 *             newRentals:
 *               type: integer
 *             revenue:
 *               type: number
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Admin dashboard verilerini getir
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Dashboard verileri
 */
router.get('/dashboard', async (req, res) => {
  try {
    // Get basic stats
    const stats = await getAdminStats();
    const recentRentals = await getRecentRentals();
    const topBooks = await getPopularBooks();
    const topUsers = await getActiveUsers();

    res.json({
      stats,
      recentRentals,
      topBooks,
      topUsers,
    });
  } catch (error) {
    console.error('Dashboard verileri getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Admin istatistiklerini getir
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: İstatistikler
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (error) {
    console.error('İstatistikler getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Tüm kullanıcıları listele (admin)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Kullanıcı listesi
 */
router.get('/users', async (req, res) => {
  try {
    const usersQuery = await pool.query(`
      SELECT 
        u.id, 
        u.first_name as "firstName", 
        u.last_name as "lastName", 
        u.email, 
        u.role,
        u.is_active as "isActive",
        u.subscription_type as "subscriptionType",
        u.subscription_end_date as "subscriptionEndDate",
        u.created_at as "created_at",
        COUNT(DISTINCT r.id) as "totalRentals",
        COUNT(DISTINCT rh.id) as "totalBooksRead"
      FROM users u
      LEFT JOIN rentals r ON u.id = r.user_id
      LEFT JOIN reading_history rh ON u.id = rh.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    
    res.json(usersQuery.rows);
  } catch (error) {
    console.error('Kullanıcıları getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Yeni kullanıcı oluştur (admin)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu
 */
router.post('/users', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role = 'user' } = req.body;
    
    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Bu e-posta adresi zaten kullanılıyor' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUserQuery = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role, is_active) 
       VALUES ($1, $2, $3, $4, $5, true) 
       RETURNING id, first_name as "firstName", last_name as "lastName", email, role, is_active as "isActive", created_at`,
      [firstName, lastName, email, hashedPassword, role]
    );
    
    res.status(201).json(newUserQuery.rows[0]);
  } catch (error) {
    console.error('Kullanıcı oluşturma hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Kullanıcı güncelle (admin)
 *     tags: [Admin]
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla güncellendi
 */
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, isActive } = req.body;
    
    const updateQuery = await pool.query(
      `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           email = COALESCE($3, email),
           role = COALESCE($4, role),
           is_active = COALESCE($5, is_active)
       WHERE id = $6
       RETURNING id, first_name as "firstName", last_name as "lastName", email, role, is_active as "isActive", created_at`,
      [firstName, lastName, email, role, isActive, id]
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
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Kullanıcı sil (admin)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla silindi
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleteQuery = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    
    if (deleteQuery.rowCount === 0) {
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
 * /api/admin/users/{id}/toggle-status:
 *   patch:
 *     summary: Kullanıcı durumunu değiştir (admin)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kullanıcı durumu güncellendi
 */
router.patch('/users/:id/toggle-status', async (req, res) => {
  try {
    const { id } = req.params;
    
    const toggleQuery = await pool.query(
      `UPDATE users 
       SET is_active = NOT is_active 
       WHERE id = $1
       RETURNING id, first_name as "firstName", last_name as "lastName", email, role, is_active as "isActive", created_at`,
      [id]
    );
    
    if (toggleQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    res.json(toggleQuery.rows[0]);
  } catch (error) {
    console.error('Kullanıcı durumu değiştirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/books:
 *   get:
 *     summary: Tüm kitapları listele (admin)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Kitap listesi
 */
router.get('/books', async (req, res) => {
  try {
    const booksQuery = await pool.query(`
      SELECT 
        b.id,
        b.title,
        b.author,
        b.description,
        b.cover_image_url as "coverImage",
        b.pdf_url as "pdfUrl",
        b.price,
        b.is_available as "isAvailable",
        b.category,
        b.isbn,
        b.publish_date as "publishDate",
        b.language,
        b.total_pages as "totalPages",
        b.created_at as "created_at",
        COUNT(r.id) as "totalRentals",
        COALESCE(AVG(rh.rating), 0) as "averageRating"
      FROM books b
      LEFT JOIN rentals r ON b.id = r.book_id
      LEFT JOIN reading_history rh ON b.id = rh.book_id
      GROUP BY b.id
      ORDER BY b.created_at DESC
    `);
    
    res.json(booksQuery.rows);
  } catch (error) {
    console.error('Kitapları getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/books/{id}:
 *   get:
 *     summary: ID'ye göre kitap getir (admin)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kitap detayları
 */
router.get('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bookQuery = await pool.query(`
      SELECT 
        b.id,
        b.title,
        b.author,
        b.description,
        b.cover_image_url as "coverImage",
        b.pdf_url as "pdfUrl",
        b.price,
        b.is_available as "isAvailable",
        b.category,
        b.isbn,
        b.publish_date as "publishDate",
        b.language,
        b.total_pages as "totalPages",
        b.created_at as "created_at",
        COUNT(r.id) as "totalRentals",
        COALESCE(AVG(rh.rating), 0) as "averageRating"
      FROM books b
      LEFT JOIN rentals r ON b.id = r.book_id
      LEFT JOIN reading_history rh ON b.id = rh.book_id
      WHERE b.id = $1
      GROUP BY b.id
    `, [id]);
    
    if (bookQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kitap bulunamadı' });
    }
    
    res.json(bookQuery.rows[0]);
  } catch (error) {
    console.error('Kitap getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/books:
 *   post:
 *     summary: Yeni kitap oluştur (admin)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               pdfUrl:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               isbn:
 *                 type: string
 *               publishDate:
 *                 type: string
 *               language:
 *                 type: string
 *               totalPages:
 *                 type: number
 *     responses:
 *       201:
 *         description: Kitap başarıyla oluşturuldu
 */
router.post('/books', async (req, res) => {
  try {
    const { 
      title, 
      author, 
      description, 
      coverImage, 
      pdfUrl, 
      price, 
      category, 
      isbn, 
      publishDate, 
      language, 
      totalPages 
    } = req.body;
    
    const newBookQuery = await pool.query(
      `INSERT INTO books (
        title, author, description, cover_image_url, pdf_url, price, 
        category, isbn, publish_date, language, total_pages, is_available
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true) 
      RETURNING *`,
      [title, author, description, coverImage, pdfUrl, price, category, isbn, publishDate, language, totalPages]
    );
    
    res.status(201).json(newBookQuery.rows[0]);
  } catch (error) {
    console.error('Kitap oluşturma hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/books/{id}:
 *   put:
 *     summary: Kitap güncelle (admin)
 *     tags: [Admin]
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
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               pdfUrl:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               isbn:
 *                 type: string
 *               publishDate:
 *                 type: string
 *               language:
 *                 type: string
 *               totalPages:
 *                 type: number
 *     responses:
 *       200:
 *         description: Kitap başarıyla güncellendi
 */
router.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      author, 
      description, 
      coverImage, 
      pdfUrl, 
      price, 
      category, 
      isbn, 
      publishDate, 
      language, 
      totalPages 
    } = req.body;
    
    const updateQuery = await pool.query(
      `UPDATE books SET 
        title = COALESCE($1, title),
        author = COALESCE($2, author),
        description = COALESCE($3, description),
        cover_image_url = COALESCE($4, cover_image_url),
        pdf_url = COALESCE($5, pdf_url),
        price = COALESCE($6, price),
        category = COALESCE($7, category),
        isbn = COALESCE($8, isbn),
        publish_date = COALESCE($9, publish_date),
        language = COALESCE($10, language),
        total_pages = COALESCE($11, total_pages)
      WHERE id = $12
      RETURNING *`,
      [title, author, description, coverImage, pdfUrl, price, category, isbn, publishDate, language, totalPages, id]
    );
    
    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kitap bulunamadı' });
    }
    
    res.json(updateQuery.rows[0]);
  } catch (error) {
    console.error('Kitap güncelleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/books/{id}:
 *   delete:
 *     summary: Kitap sil (admin)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kitap başarıyla silindi
 */
router.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleteQuery = await pool.query('DELETE FROM books WHERE id = $1 RETURNING id', [id]);
    
    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kitap bulunamadı' });
    }
    
    res.json({ message: 'Kitap başarıyla silindi' });
  } catch (error) {
    console.error('Kitap silme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/books/{id}/toggle-availability:
 *   patch:
 *     summary: Kitap kullanılabilirlik durumunu değiştir (admin)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kitap durumu güncellendi
 */
router.patch('/books/:id/toggle-availability', async (req, res) => {
  try {
    const { id } = req.params;
    
    const toggleQuery = await pool.query(
      `UPDATE books 
       SET is_available = NOT is_available 
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    
    if (toggleQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kitap bulunamadı' });
    }
    
    res.json(toggleQuery.rows[0]);
  } catch (error) {
    console.error('Kitap durumu değiştirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/rentals:
 *   get:
 *     summary: Tüm kiralama işlemlerini listele (admin)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Kiralama listesi
 */
router.get('/rentals', async (req, res) => {
  try {
    const rentalsQuery = await pool.query(`
      SELECT 
        r.id,
        r.rental_date as "rentalDate",
        r.return_date as "returnDate",
        r.status,
        b.id as "bookId",
        b.title as "bookTitle",
        b.author as "bookAuthor",
        b.cover_image_url as "bookCoverImage",
        b.price as "bookPrice",
        u.id as "userId",
        u.first_name as "userFirstName",
        u.last_name as "userLastName",
        u.email as "userEmail",
        CASE 
          WHEN r.status = 'active' AND r.return_date < CURRENT_DATE 
          THEN EXTRACT(DAY FROM CURRENT_DATE - r.return_date)::INTEGER
          ELSE 0
        END as "overdueDays"
      FROM rentals r
      JOIN books b ON r.book_id = b.id
      JOIN users u ON r.user_id = u.id
      ORDER BY r.rental_date DESC
    `);
    
    const rentals = rentalsQuery.rows.map(row => ({
      id: row.id,
      rentalDate: row.rentalDate,
      returnDate: row.returnDate,
      status: row.status,
      overdueDays: row.overdueDays,
      book: {
        id: row.bookId,
        title: row.bookTitle,
        author: row.bookAuthor,
        coverImage: row.bookCoverImage,
        price: row.bookPrice
      },
      user: {
        id: row.userId,
        firstName: row.userFirstName,
        lastName: row.userLastName,
        email: row.userEmail
      }
    }));
    
    res.json(rentals);
  } catch (error) {
    console.error('Kiralama verilerini getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/rentals/available-books:
 *   get:
 *     summary: Kiralanabilir kitapları listele (admin)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Kiralanabilir kitap listesi
 */
router.get('/rentals/available-books', async (req, res) => {
  try {
    const availableBooksQuery = await pool.query(`
      SELECT 
        b.id,
        b.title,
        b.author,
        b.description,
        b.cover_image_url as "coverImage",
        b.price,
        b.category,
        b.isbn,
        b.publish_date as "publishDate",
        b.language,
        b.total_pages as "totalPages",
        b.created_at as "created_at",
        COUNT(r.id) as "totalRentals"
      FROM books b
      LEFT JOIN rentals r ON b.id = r.book_id
      WHERE b.is_available = true
      GROUP BY b.id
      ORDER BY b.title
    `);
    
    res.json(availableBooksQuery.rows);
  } catch (error) {
    console.error('Kiralanabilir kitapları getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/rentals/{id}:
 *   get:
 *     summary: ID'ye göre kiralama detayı getir (admin)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kiralama detayları
 */
router.get('/rentals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rentalQuery = await pool.query(`
      SELECT 
        r.id,
        r.rental_date as "rentalDate",
        r.return_date as "returnDate",
        r.status,
        b.id as "bookId",
        b.title as "bookTitle",
        b.author as "bookAuthor",
        b.cover_image_url as "bookCoverImage",
        b.price as "bookPrice",
        u.id as "userId",
        u.first_name as "userFirstName",
        u.last_name as "userLastName",
        u.email as "userEmail",
        CASE 
          WHEN r.status = 'active' AND r.return_date < CURRENT_DATE 
          THEN EXTRACT(DAY FROM CURRENT_DATE - r.return_date)::INTEGER
          ELSE 0
        END as "overdueDays"
      FROM rentals r
      JOIN books b ON r.book_id = b.id
      JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `, [id]);
    
    if (rentalQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kiralama bulunamadı' });
    }
    
    const row = rentalQuery.rows[0];
    const rental = {
      id: row.id,
      rentalDate: row.rentalDate,
      returnDate: row.returnDate,
      status: row.status,
      overdueDays: row.overdueDays,
      book: {
        id: row.bookId,
        title: row.bookTitle,
        author: row.bookAuthor,
        coverImage: row.bookCoverImage,
        price: row.bookPrice
      },
      user: {
        id: row.userId,
        firstName: row.userFirstName,
        lastName: row.userLastName,
        email: row.userEmail
      }
    };
    
    res.json(rental);
  } catch (error) {
    console.error('Kiralama detayı getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/rentals/{id}/status:
 *   patch:
 *     summary: Kiralama durumunu güncelle (admin)
 *     tags: [Admin]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, returned, overdue, cancelled]
 *     responses:
 *       200:
 *         description: Kiralama durumu güncellendi
 */
router.patch('/rentals/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    let updateQuery;
    if (status === 'returned') {
      updateQuery = await pool.query(
        `UPDATE rentals 
         SET status = $1, return_date = CURRENT_TIMESTAMP 
         WHERE id = $2
         RETURNING *`,
        [status, id]
      );
    } else {
      updateQuery = await pool.query(
        `UPDATE rentals 
         SET status = $1 
         WHERE id = $2
         RETURNING *`,
        [status, id]
      );
    }
    
    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kiralama bulunamadı' });
    }
    
    res.json(updateQuery.rows[0]);
  } catch (error) {
    console.error('Kiralama durumu güncelleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/admin/rentals/{id}/extend:
 *   patch:
 *     summary: Kiralama süresini uzat (admin)
 *     tags: [Admin]
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
 *               - days
 *             properties:
 *               days:
 *                 type: number
 *     responses:
 *       200:
 *         description: Kiralama süresi uzatıldı
 */
router.patch('/rentals/:id/extend', async (req, res) => {
  try {
    const { id } = req.params;
    const { days } = req.body;
    
    const extendQuery = await pool.query(
      `UPDATE rentals 
       SET return_date = return_date + INTERVAL '${days} days'
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    
    if (extendQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kiralama bulunamadı' });
    }
    
    res.json(extendQuery.rows[0]);
  } catch (error) {
    console.error('Kiralama uzatma hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Helper functions
async function getAdminStats() {
  const [
    usersCount,
    booksCount,
    rentalsCount,
    activeRentalsCount,
    overdueRentalsCount,
    totalRevenue,
    monthlyStats
  ] = await Promise.all([
    pool.query('SELECT COUNT(*) as count FROM users'),
    pool.query('SELECT COUNT(*) as count FROM books'),
    pool.query('SELECT COUNT(*) as count FROM rentals'),
    pool.query("SELECT COUNT(*) as count FROM rentals WHERE status = 'active'"),
    pool.query("SELECT COUNT(*) as count FROM rentals WHERE status = 'overdue'"),
    pool.query('SELECT COALESCE(SUM(price), 0) as total FROM rentals r JOIN books b ON r.book_id = b.id'),
    getMonthlyStats()
  ]);

  return {
    totalUsers: parseInt(usersCount.rows[0].count),
    totalBooks: parseInt(booksCount.rows[0].count),
    totalRentals: parseInt(rentalsCount.rows[0].count),
    activeRentals: parseInt(activeRentalsCount.rows[0].count),
    overdueRentals: parseInt(overdueRentalsCount.rows[0].count),
    totalRevenue: parseFloat(totalRevenue.rows[0].total),
    monthlyStats
  };
}

async function getMonthlyStats() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [
    newUsers,
    newBooks,
    newRentals,
    monthlyRevenue
  ] = await Promise.all([
    pool.query(
      'SELECT COUNT(*) as count FROM users WHERE EXTRACT(MONTH FROM created_at) = $1 AND EXTRACT(YEAR FROM created_at) = $2',
      [currentMonth, currentYear]
    ),
    pool.query(
      'SELECT COUNT(*) as count FROM books WHERE EXTRACT(MONTH FROM created_at) = $1 AND EXTRACT(YEAR FROM created_at) = $2',
      [currentMonth, currentYear]
    ),
    pool.query(
      'SELECT COUNT(*) as count FROM rentals WHERE EXTRACT(MONTH FROM rental_date) = $1 AND EXTRACT(YEAR FROM rental_date) = $2',
      [currentMonth, currentYear]
    ),
    pool.query(
      `SELECT COALESCE(SUM(b.price), 0) as total 
       FROM rentals r 
       JOIN books b ON r.book_id = b.id 
       WHERE EXTRACT(MONTH FROM r.rental_date) = $1 AND EXTRACT(YEAR FROM r.rental_date) = $2`,
      [currentMonth, currentYear]
    )
  ]);

  return {
    newUsers: parseInt(newUsers.rows[0].count),
    newBooks: parseInt(newBooks.rows[0].count),
    newRentals: parseInt(newRentals.rows[0].count),
    revenue: parseFloat(monthlyRevenue.rows[0].total)
  };
}

async function getRecentRentals() {
  const rentalsQuery = await pool.query(`
    SELECT 
      r.id,
      r.rental_date as "rentalDate",
      r.return_date as "returnDate",
      r.status,
      b.id as "bookId",
      b.title as "bookTitle",
      b.author as "bookAuthor",
      u.id as "userId",
      u.first_name as "userFirstName",
      u.last_name as "userLastName"
    FROM rentals r
    JOIN books b ON r.book_id = b.id
    JOIN users u ON r.user_id = u.id
    ORDER BY r.rental_date DESC
    LIMIT 10
  `);

  return rentalsQuery.rows.map(row => ({
    id: row.id,
    rentalDate: row.rentalDate,
    returnDate: row.returnDate,
    status: row.status,
    book: {
      id: row.bookId,
      title: row.bookTitle,
      author: row.bookAuthor
    },
    user: {
      id: row.userId,
      firstName: row.userFirstName,
      lastName: row.userLastName
    }
  }));
}

async function getPopularBooks() {
  const booksQuery = await pool.query(`
    SELECT 
      b.id,
      b.title,
      b.author,
      b.description,
      b.cover_image_url as "coverImage",
      b.price,
      b.created_at as "created_at",
      COUNT(r.id) as "totalRentals"
    FROM books b
    LEFT JOIN rentals r ON b.id = r.book_id
    GROUP BY b.id
    ORDER BY "totalRentals" DESC
    LIMIT 10
  `);

  return booksQuery.rows;
}

async function getActiveUsers() {
  const usersQuery = await pool.query(`
    SELECT 
      u.id,
      u.first_name as "firstName",
      u.last_name as "lastName",
      u.email,
      u.role,
      u.subscription_type as "subscriptionType",
      u.created_at as "created_at",
      COUNT(DISTINCT r.id) as "totalRentals",
      COUNT(DISTINCT rh.id) as "totalBooksRead"
    FROM users u
    LEFT JOIN rentals r ON u.id = r.user_id
    LEFT JOIN reading_history rh ON u.id = rh.user_id
    WHERE u.is_active = true
    GROUP BY u.id
    ORDER BY "totalRentals" DESC
    LIMIT 10
  `);

  return usersQuery.rows;
}

module.exports = router; 