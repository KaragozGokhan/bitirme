const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

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
    const booksQuery = await pool.query('SELECT * FROM books ORDER BY title');
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
    const bookQuery = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    
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
router.post('/:id/rent', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    
    const bookQuery = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    
    if (bookQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kitap bulunamadı' });
    }

    const existingRentalQuery = await pool.query(
      'SELECT * FROM rentals WHERE user_id = $1 AND book_id = $2 AND status = $3',
      [user_id, id, 'active']
    );

    if (existingRentalQuery.rows.length > 0) {
      return res.status(400).json({ error: 'Bu kitap zaten kiralanmış' });
    }

    const rentalQuery = await pool.query(
      'INSERT INTO rentals (user_id, book_id, return_date) VALUES ($1, $2, $3) RETURNING *',
      [user_id, id, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
    );

    res.status(201).json({
      message: 'Kitap başarıyla kiralandı',
      rental: rentalQuery.rows[0]
    });
  } catch (error) {
    console.error('Kitap kiralama hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/books/{id}/reading-progress:
 *   post:
 *     summary: Okuma kaydı oluştur veya güncelle
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
 *               - page
 *             properties:
 *               user_id:
 *                 type: integer
 *               page:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Okuma kaydı güncellendi
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
router.post('/:id/reading-progress', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, page } = req.body;

    const bookQuery = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    
    if (bookQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kitap bulunamadı' });
    }

    const existingHistoryQuery = await pool.query(
      'SELECT * FROM reading_history WHERE user_id = $1 AND book_id = $2',
      [user_id, id]
    );

    let historyRecord;

    if (existingHistoryQuery.rows.length === 0) {
      historyRecord = await pool.query(
        'INSERT INTO reading_history (user_id, book_id, last_page) VALUES ($1, $2, $3) RETURNING *',
        [user_id, id, page]
      );
    } else {
      historyRecord = await pool.query(
        'UPDATE reading_history SET last_page = $1, last_read = CURRENT_TIMESTAMP WHERE user_id = $2 AND book_id = $3 RETURNING *',
        [page, user_id, id]
      );
    }

    res.status(200).json({
      message: 'Okuma kaydı güncellendi',
      history: historyRecord.rows[0]
    });
  } catch (error) {
    console.error('Okuma kaydı hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router; 