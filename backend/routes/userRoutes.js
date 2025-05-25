const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

// Kullanıcı profilini getir
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      subscription_type: req.user.subscription_type,
      subscription_end_date: req.user.subscription_end_date,
      created_at: req.user.created_at
    });
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kullanıcının kiraladığı kitapları getir
router.get('/rentals', auth, async (req, res) => {
  try {
    const rentalsQuery = await pool.query(
      `SELECT r.id as rental_id, r.rental_date, r.return_date, r.status,
        b.id as book_id, b.title, b.author, b.cover_image_url
        FROM rentals r
        JOIN books b ON r.book_id = b.id
        WHERE r.user_id = $1 ORDER BY r.rental_date DESC`,
      [req.user.id]
    );

    res.json(rentalsQuery.rows);
  } catch (error) {
    console.error('Kiralama getirme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kullanıcının okuma geçmişini getir
router.get('/reading-history', auth, async (req, res) => {
  try {
    const historyQuery = await pool.query(
      `SELECT rh.id as history_id, rh.last_page, rh.last_read,
        b.id as book_id, b.title, b.author, b.cover_image_url
        FROM reading_history rh
        JOIN books b ON rh.book_id = b.id
        WHERE rh.user_id = $1 ORDER BY rh.last_read DESC`,
      [req.user.id]
    );

    res.json(historyQuery.rows);
  } catch (error) {
    console.error('Okuma geçmişi hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kullanıcı aboneliğini güncelle
router.post('/subscription', auth, async (req, res) => {
  try {
    const { subscription_type, months } = req.body;
    
    // Abonelik bitiş tarihini hesaplıyoruz
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + parseInt(months));
    
    // Kullanıcı aboneliğini güncelliyoruz
    await pool.query(
      'UPDATE users SET subscription_type = $1, subscription_end_date = $2 WHERE id = $3',
      [subscription_type, endDate, req.user.id]
    );
    
    res.json({ 
      message: 'Abonelik başarıyla güncellendi',
      subscription_type,
      subscription_end_date: endDate
    });
  } catch (error) {
    console.error('Abonelik güncelleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router; 