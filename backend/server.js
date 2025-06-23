const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { pool } = require('./config/database');

// Route dosyalarını içe aktarıyoruz
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Database migration kontrolü
async function checkAndCreateTables() {
  try {
    // user_books tablosunun var olup olmadığını kontrol et
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_books'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('user_books tablosu bulunamadı, oluşturuluyor...');
      
      // user_books tablosunu oluştur
      await pool.query(`
        CREATE TABLE user_books (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
          acquisition_method VARCHAR(20) NOT NULL DEFAULT 'purchase',
          acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, book_id)
        );
      `);
      
      console.log('✅ user_books tablosu başarıyla oluşturuldu!');
    } else {
      console.log('✅ user_books tablosu zaten mevcut');
    }
  } catch (error) {
    console.error('❌ Database migration hatası:', error);
  }
}

// Swagger konfigürasyonu
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kitap Kiralama API',
      version: '1.0.0',
      description: 'Kitap kiralama ve okuma platformu için REST API',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Geliştirme sunucusu',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: []
      }
    ],
  },
  apis: ['./routes/*.js'], // Route dosyalarının yolu
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Static dosyalar için middleware - PDF ve görsel dosyaları serve et
app.use('/pdfurl', express.static(path.join(__dirname, '../frontend/pdfurl')));
app.use('/kitaplar', express.static(path.join(__dirname, '../frontend/kitaplar')));

// Route'ları tanımlıyoruz
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Kitap Kiralama API çalışıyor!' });
});

// Sunucuyu başlat
app.listen(port, async () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
  console.log(`Swagger dokümantasyonu: http://localhost:${port}/api-docs`);
  
  // Database migration'ını çalıştır
  await checkAndCreateTables();
}); 