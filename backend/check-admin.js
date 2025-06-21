const bcrypt = require('bcrypt');
const { pool } = require('./config/database');

async function checkAdminUser() {
  try {
    // Check if admin user exists
    const result = await pool.query('SELECT id, first_name, last_name, email, password_hash, role, is_active FROM users WHERE email = $1', ['admin@example.com']);
    
    if (result.rows.length === 0) {
      console.log('❌ Admin user does not exist!');
      console.log('Creating admin user...');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newUser = await pool.query(
        `INSERT INTO users (first_name, last_name, email, password_hash, role, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, first_name, last_name, email, role`,
        ['Admin', 'User', 'admin@example.com', hashedPassword, 'admin', true]
      );
      
      console.log('✅ Admin user created successfully!');
      console.log('Login credentials:');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
    } else {
      const user = result.rows[0];
      console.log('✅ Admin user exists:');
      console.log(`ID: ${user.id}`);
      console.log(`Name: ${user.first_name} ${user.last_name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Active: ${user.is_active}`);
      
      // Test password
      const testPassword = 'admin123';
      const isValid = await bcrypt.compare(testPassword, user.password_hash);
      
      if (isValid) {
        console.log('✅ Password is correct!');
      } else {
        console.log('❌ Password is incorrect. Updating password...');
        
        // Update password
        const newHashedPassword = await bcrypt.hash('admin123', 10);
        await pool.query(
          'UPDATE users SET password_hash = $1 WHERE email = $2',
          [newHashedPassword, 'admin@example.com']
        );
        
        console.log('✅ Password updated successfully!');
        console.log('New login credentials:');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
      }
    }
    
    pool.end();
  } catch (error) {
    console.error('❌ Error checking admin user:', error);
    pool.end();
  }
}

checkAdminUser(); 