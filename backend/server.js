const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { pool } = require('./config/database');

// Route dosyalarını içe aktarıyoruz
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

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
  },
  apis: ['./routes/*.js'], // Route dosyalarının yolu
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(cors());
app.use(express.json());

// Route'ları tanımlıyoruz
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Kitap Kiralama API çalışıyor!' });
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
  console.log(`Swagger dokümantasyonu: http://localhost:${port}/api-docs`);
}); 