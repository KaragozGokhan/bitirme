const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'Bookflix',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

// Bağlantıyı test et
pool.connect((err, client, release) => {
    if (err) {
        console.error('Veritabanına bağlanırken hata oluştu:', err.stack);
    } else {
        console.log('PostgreSQL veritabanına başarıyla bağlandı');
        release();
    }
});

module.exports = { pool }; 