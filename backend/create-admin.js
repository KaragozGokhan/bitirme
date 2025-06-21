const bcrypt = require('bcrypt');
const { pool } = require('./config/database');

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@example.com']);
    
    if (existingUser.rows.length > 0) {
      console.log('Admin user already exists!');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    const newUser = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, role, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, first_name, last_name, email, role`,
      ['Admin', 'User', 'admin@example.com', hashedPassword, 'admin', true]
    );
    
    console.log('Admin user created successfully!');
    console.log('Login credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    
    pool.end();
  } catch (error) {
    console.error('Error creating admin user:', error);
    pool.end();
  }
}

createAdminUser(); 