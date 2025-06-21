const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const authenticateToken = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Yorum işlemleri
 */

/**
 * @swagger
 * /api/comments/:
 *   post:
 *     summary: Yorum ekle
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *               - book_id
 *               - rate
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Çok güzel bir kitap!"
 *               book_id:
 *                 type: integer
 *                 example: 1
 *               rate:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *                 example: 8
 *     responses:
 *       201:
 *         description: Yorum başarıyla eklendi
 *       400:
 *         description: Eksik bilgi
 *       401:
 *         description: Yetkisiz
 */
// Yorum ekle (sadece giriş yapmış kullanıcı)
router.post('/', authenticateToken, async (req, res) => {
    const { comment, book_id, rate } = req.body;
    const user_id = req.user.id;
    if (!comment || !book_id || rate === undefined) {
        return res.status(400).json({ message: 'Yorum, kitap ID ve rate gerekli.' });
    }
    if (typeof rate !== 'number' || rate < 1 || rate > 10) {
        return res.status(400).json({ message: 'Rate 1 ile 10 arasında bir sayı olmalı.' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO comments (comment, book_id, user_id, rate) VALUES ($1, $2, $3, $4) RETURNING *',
            [comment, book_id, user_id, rate]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Yorum eklenemedi.', error: err.message });
    }
});

/**
 * @swagger
 * /api/comments/book/{bookId}:
 *   get:
 *     summary: Kitap ID'ye göre yorumları getir
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Kitap ID
 *     responses:
 *       200:
 *         description: Yorumlar listelendi
 *       404:
 *         description: Yorum bulunamadı
 */
// Kitap ID'ye göre yorumları getir
router.get('/book/:bookId', async (req, res) => {
    const { bookId } = req.params;
    try {
        const result = await pool.query(
            'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.book_id = $1 ORDER BY c.created_at DESC',
            [bookId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Yorumlar alınamadı.', error: err.message });
    }
});

/**
 * @swagger
 * /api/comments/user/{userId}:
 *   get:
 *     summary: Kullanıcı ID'ye göre yorumları getir
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Kullanıcı ID
 *     responses:
 *       200:
 *         description: Yorumlar listelendi
 *       404:
 *         description: Yorum bulunamadı
 */
// Kullanıcı ID'ye göre yorumları getir
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(
            'SELECT c.*, b.title FROM comments c JOIN books b ON c.book_id = b.id WHERE c.user_id = $1 ORDER BY c.created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Yorumlar alınamadı.', error: err.message });
    }
});

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Yorumu sil
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Yorum ID
 *     responses:
 *       200:
 *         description: Yorum silindi
 *       401:
 *         description: Yetkisiz
 *       403:
 *         description: Yetkiniz yok
 *       404:
 *         description: Yorum bulunamadı
 */
// Belirli bir yorumu sil (sadece yorumu yazan veya admin)
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        // Yorumun sahibi mi kontrol et
        const check = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
        if (check.rows.length === 0) return res.status(404).json({ message: 'Yorum bulunamadı.' });
        if (check.rows[0].user_id !== user_id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bu yorumu silme yetkiniz yok.' });
        }
        await pool.query('DELETE FROM comments WHERE id = $1', [id]);
        res.json({ message: 'Yorum silindi.' });
    } catch (err) {
        res.status(500).json({ message: 'Yorum silinemedi.', error: err.message });
    }
});

/**
 * @swagger
 * /api/comments/:
 *   get:
 *     summary: Tüm yorumları getir (sadece admin)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Yorumlar listelendi
 *       401:
 *         description: Yetkisiz
 *       403:
 *         description: Yetkiniz yok
 */
// Tüm yorumları getir (opsiyonel, sadece admin)
router.get('/', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Yetkisiz.' });
    try {
        const result = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Yorumlar alınamadı.', error: err.message });
    }
});

module.exports = router; 