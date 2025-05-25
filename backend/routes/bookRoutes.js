const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

// Tüm kitapları getir
router.get('/', async (req, res) => {
  try {
    const booksQuery = await pool.query('SELECT * FROM books ORDER BY title');
    res.json(booksQuery.rows);
  } catch (error) {
    console.error('Kitapları getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// ID'ye göre kitap getir
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

// Kitap kirala
router.post('/:id/rent', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Kitabın var olup olmadığını kontrol ediyoruz
    const bookQuery = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    
    if (bookQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kitap bulunamadı' });
    }

    // Kullanıcının bu kitabı daha önce kiralamış mı kontrol ediyoruz
    const existingRentalQuery = await pool.query(
      'SELECT * FROM rentals WHERE user_id = $1 AND book_id = $2 AND status = $3',
      [userId, id, 'active']
    );

    if (existingRentalQuery.rows.length > 0) {
      return res.status(400).json({ error: 'Bu kitap zaten kiralanmış' });
    }

    // Kiralama kaydı oluşturuyoruz
    const rentalQuery = await pool.query(
      'INSERT INTO rentals (user_id, book_id, return_date) VALUES ($1, $2, $3) RETURNING *',
      [userId, id, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
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

// Okuma kaydı oluştur veya güncelle
router.post('/:id/reading-progress', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { page } = req.body;
    const userId = req.user.id;

    // Kitabın var olup olmadığını kontrol ediyoruz
    const bookQuery = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    
    if (bookQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Kitap bulunamadı' });
    }

    // Okuma kaydı var mı kontrol ediyoruz
    const existingHistoryQuery = await pool.query(
      'SELECT * FROM reading_history WHERE user_id = $1 AND book_id = $2',
      [userId, id]
    );

    let historyRecord;

    if (existingHistoryQuery.rows.length === 0) {
      // Yeni okuma kaydı oluşturuyoruz
      historyRecord = await pool.query(
        'INSERT INTO reading_history (user_id, book_id, last_page) VALUES ($1, $2, $3) RETURNING *',
        [userId, id, page]
      );
    } else {
      // Mevcut okuma kaydını güncelliyoruz
      historyRecord = await pool.query(
        'UPDATE reading_history SET last_page = $1, last_read = CURRENT_TIMESTAMP WHERE user_id = $2 AND book_id = $3 RETURNING *',
        [page, userId, id]
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