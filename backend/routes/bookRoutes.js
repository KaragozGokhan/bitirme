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
 *         audio_url:
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
 * /api/books/categories/{categoryId}:
 *   get:
 *     summary: Belirli bir kategorideki kitapları listele
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Kategori ID'si
 *     responses:
 *       200:
 *         description: Kategoriye ait kitap listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       404:
 *         description: Kategori bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
/**
 * @swagger
 * /api/books/categories:
 *   get:
 *     summary: Tüm kategorileri listele
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Kategori listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.get('/categories', async (req, res) => {
  try {
    const categoriesQuery = await pool.query('SELECT id, name FROM categories ORDER BY name');
    res.json(categoriesQuery.rows);
  } catch (error) {
    console.error('Kategorileri getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

router.get('/categories/:categoryId', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    
    // Kategori bilgisini getir
    const categoryQuery = await pool.query(
      'SELECT id, name FROM categories WHERE id = $1',
      [categoryId]
    );
    
    if (categoryQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kategori bulunamadı' });
    }
    
    // Bu kategorideki kitapları getir
    const booksQuery = await pool.query(
      'SELECT * FROM books WHERE $1 = ANY(categories) ORDER BY title',
      [categoryId]
    );
    
    res.json({
      category: categoryQuery.rows[0],
      books: booksQuery.rows
    });
  } catch (error) {
    console.error('Kategori kitaplarını getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/books/rented:
 *   get:
 *     summary: Kiralanan tüm kitapları getir
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Kiralanan kitapların listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rental_id:
 *                     type: integer
 *                   book_id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   user_id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   rental_date:
 *                     type: string
 *                     format: date-time
 *                   return_date:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 */
router.get('/rented', async (req, res) => {
  try {
    const rentedBooksQuery = await pool.query(
      `SELECT 
        r.id as rental_id,
        b.id as book_id,
        b.title,
        b.author,
        u.id as user_id,
        u.username,
        r.rental_date,
        r.return_date,
        r.status
      FROM rentals r
      JOIN books b ON r.book_id = b.id
      JOIN users u ON r.user_id = u.id
      WHERE r.status = 'active'
      ORDER BY r.rental_date DESC`
    );

    res.json(rentedBooksQuery.rows);
  } catch (error) {
    console.error('Kiralanan kitapları getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/books/rented:
 *   get:
 *     summary: Kiralanan tüm kitapları getir
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Kiralanan kitapların listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rental_id:
 *                     type: integer
 *                   book_id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   user_id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   rental_date:
 *                     type: string
 *                     format: date-time
 *                   return_date:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 */
router.get('/rented', async (req, res) => {
  try {
    const rentedBooksQuery = await pool.query(
      `SELECT 
        r.id as rental_id,
        b.id as book_id,
        b.title,
        b.author,
        u.id as user_id,
        u.username,
        r.rental_date,
        r.return_date,
        r.status
      FROM rentals r
      JOIN books b ON r.book_id = b.id
      JOIN users u ON r.user_id = u.id
      WHERE r.status = 'active'
      ORDER BY r.rental_date DESC`
    );

    res.json(rentedBooksQuery.rows);
  } catch (error) {
    console.error('Kiralanan kitapları getirme hatası:', error);
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
 *               $ref: '#/components/schemas/Book'
 */
router.post('/', async (req, res) => {
  try {
    const { title, author, description, cover_image_url, pdf_url, audio_url, price } = req.body;
    
    const newBookQuery = await pool.query(
      'INSERT INTO books (title, author, description, cover_image_url, pdf_url, audio_url, price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, author, description, cover_image_url, pdf_url, audio_url, price]
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
 */
router.put('/:id', async (req, res) => {
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

/**
 * @swagger
 * /api/books/categories:
 *   get:
 *     summary: Tüm kategorileri listele
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Kategori listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.get('/categories', async (req, res) => {
  try {
    const categoriesQuery = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(categoriesQuery.rows);
  } catch (error) {
    console.error('Kategorileri getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/books/categories:
 *   post:
 *     summary: Yeni kategori ekle
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kategori başarıyla eklendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       400:
 *         description: Bu kategori zaten mevcut
 */
router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    
    // Kategori zaten var mı kontrol et
    const existingCategory = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);
    
    if (existingCategory.rows.length > 0) {
      return res.status(400).json({ error: 'Bu kategori zaten mevcut' });
    }
    
    const newCategoryQuery = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    
    res.status(201).json(newCategoryQuery.rows[0]);
  } catch (error) {
    console.error('Kategori ekleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/books/categories/{id}:
 *   put:
 *     summary: Kategori güncelle
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kategori başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: Kategori bulunamadı
 */
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const updateQuery = await pool.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    
    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kategori bulunamadı' });
    }
    
    res.json(updateQuery.rows[0]);
  } catch (error) {
    console.error('Kategori güncelleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/books/categories/{id}:
 *   delete:
 *     summary: Kategori sil
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kategori başarıyla silindi
 *       404:
 *         description: Kategori bulunamadı
 */
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleteQuery = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    
    if (deleteQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kategori bulunamadı' });
    }
    
    res.json({ message: 'Kategori başarıyla silindi' });
  } catch (error) {
    console.error('Kategori silme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

/**
 * @swagger
 * /api/books/{id}/audio-access:
 *   get:
 *     summary: Kullanıcının ses kitabı erişimini kontrol et
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Erişim durumu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 has_access:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 audio_url:
 *                   type: string
 */
router.get('/:id/audio-access', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query;
    
    // Kitabı kontrol et
    const bookQuery = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    
    if (bookQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kitap bulunamadı' });
    }
    
    const book = bookQuery.rows[0];
    
    // Kullanıcının üyeliğini kontrol et
    const userQuery = await pool.query('SELECT * FROM users WHERE id = $1', [user_id]);
    
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    const user = userQuery.rows[0];
    
    // Üyelik kontrolü
    const isPremium = user.subscription_type === 'premium' || user.subscription_type === 'yearly';
    const isSubscriptionActive = user.subscription_end_date && new Date(user.subscription_end_date) > new Date();
    
    const hasAccess = isPremium && isSubscriptionActive;
    
    if (hasAccess && book.audio_url) {
      res.json({
        has_access: true,
        message: 'Ses kitabı erişimi mevcut',
        audio_url: book.audio_url
      });
    } else if (!hasAccess) {
      res.json({
        has_access: false,
        message: 'Ses kitabı erişimi için premium üyelik gerekli',
        audio_url: null
      });
    } else {
      res.json({
        has_access: false,
        message: 'Bu kitap için ses versiyonu mevcut değil',
        audio_url: null
      });
    }
  } catch (error) {
    console.error('Ses kitabı erişim kontrolü hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router; 