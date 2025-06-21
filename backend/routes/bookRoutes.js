const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         description:
 *           type: string
 *         cover_image_url:
 *           type: string
 *         pdf_url:
 *           type: string
 *         price:
 *           type: number
 *     Rental:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         book_id:
 *           type: integer
 *         return_date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *     ReadingHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         book_id:
 *           type: integer
 *         last_page:
 *           type: integer
 *         last_read:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Tüm kitapları listele
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Kitap listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/', async (req, res) => {
  try {
    const booksQuery = await pool.query(`
      SELECT 
        id,
        title,
        author,
        description,
        cover_image_url as "coverImage",
        pdf_url as "pdfUrl",
        price,
        is_available as "isAvailable",
        created_at as "created_at"
      FROM books 
      ORDER BY title
    `);
    res.json(booksQuery.rows);
  } catch (error) {
    console.error('Kitapları getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: ID'ye göre kitap getir
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kitap detayları
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Kitap bulunamadı
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bookQuery = await pool.query(`
      SELECT 
        id,
        title,
        author,
        description,
        cover_image_url as "coverImage",
        pdf_url as "pdfUrl",
        price,
        is_available as "isAvailable",
        created_at as "created_at"
      FROM books 
      WHERE id = $1
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
 * /api/books:
 *   post:
 *     summary: Yeni kitap ekle
 *     tags: [Books]
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
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Kitap başarıyla eklendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */
router.post('/', async (req, res) => {
  try {
    const { title, author, description, cover_image_url, pdf_url, price } = req.body;
    
    const newBookQuery = await pool.query(
      'INSERT INTO books (title, author, description, cover_image_url, pdf_url, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, author, description, cover_image_url, pdf_url, price]
    );
    
    res.status(201).json(newBookQuery.rows[0]);
  } catch (error) {
    console.error('Kitap ekleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Kitap güncelle
 *     tags: [Books]
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
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, cover_image_url, pdf_url, price } = req.body;
    
    const updateQuery = await pool.query(
      'UPDATE books SET title = $1, author = $2, description = $3, cover_image_url = $4, pdf_url = $5, price = $6 WHERE id = $7 RETURNING *',
      [title, author, description, cover_image_url, pdf_url, price, id]
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
 * /api/books/{id}:
 *   delete:
 *     summary: Kitap sil
 *     tags: [Books]
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
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleteQuery = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    
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
 * /api/books/{id}/rent:
 *   post:
 *     summary: Kitap kirala
 *     tags: [Books]
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
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Kitap başarıyla kiralandı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 rental:
 *                   $ref: '#/components/schemas/Rental'
 *       404:
 *         description: Kitap bulunamadı
 *       400:
 *         description: Kitap zaten kiralanmış
 */
router.post('/:id/rent', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if book exists and is available
    const bookQuery = await pool.query('SELECT * FROM books WHERE id = $1 AND is_available = true', [id]);
    if (bookQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kitap bulunamadı veya mevcut değil' });
    }

    // Check if user already has this book rented
    const existingRental = await pool.query(
      'SELECT * FROM rentals WHERE user_id = $1 AND book_id = $2 AND status = $3',
      [userId, id, 'active']
    );
    if (existingRental.rows.length > 0) {
      return res.status(400).json({ error: 'Bu kitabı zaten kiralamışsınız' });
    }

    // Calculate return date (14 days from now)
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 14);

    // Create rental
    const rentalQuery = await pool.query(
      'INSERT INTO rentals (user_id, book_id, return_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, id, returnDate, 'active']
    );

    // Update book availability
    await pool.query('UPDATE books SET is_available = false WHERE id = $1', [id]);

    res.status(201).json(rentalQuery.rows[0]);
  } catch (error) {
    console.error('Kitap kiralama hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/books/{id}/return:
 *   post:
 *     summary: Kitap iade et
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kitap başarıyla iade edildi
 *       404:
 *         description: Kitap bulunamadı
 */
router.post('/:id/return', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user has this book rented
    const rentalQuery = await pool.query(
      'SELECT * FROM rentals WHERE user_id = $1 AND book_id = $2 AND status = $3',
      [userId, id, 'active']
    );
    if (rentalQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Bu kitabı kiralamamışsınız' });
    }

    // Update rental status
    await pool.query(
      'UPDATE rentals SET status = $1 WHERE user_id = $2 AND book_id = $3 AND status = $4',
      ['returned', userId, id, 'active']
    );

    // Update book availability
    await pool.query('UPDATE books SET is_available = true WHERE id = $1', [id]);

    res.json({ message: 'Kitap başarıyla iade edildi' });
  } catch (error) {
    console.error('Kitap iade hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/books/{id}/progress:
 *   post:
 *     summary: Okuma ilerlemesi güncelle
 *     tags: [Books]
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
 *               - page
 *             properties:
 *               page:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Okuma ilerlemesi güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 history:
 *                   $ref: '#/components/schemas/ReadingHistory'
 *       404:
 *         description: Kitap bulunamadı
 */
router.post('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { page } = req.body;
    const userId = req.user.id;

    // Update or create reading history
    const historyQuery = await pool.query(
      `INSERT INTO reading_history (user_id, book_id, last_page, last_read) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
       ON CONFLICT (user_id, book_id) 
       DO UPDATE SET last_page = $3, last_read = CURRENT_TIMESTAMP 
       RETURNING *`,
      [userId, id, page]
    );

    res.json(historyQuery.rows[0]);
  } catch (error) {
    console.error('Okuma ilerlemesi güncelleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router; 