const { pool } = require('./config/database');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    
    // Test admin user
    const adminQuery = await client.query(
      'SELECT id, first_name, last_name, email, role FROM users WHERE email = $1',
      ['admin@example.com']
    );
    
    if (adminQuery.rows.length > 0) {
      const admin = adminQuery.rows[0];
      console.log('✅ Admin user found:');
      console.log(`   ID: ${admin.id}`);
      console.log(`   Name: ${admin.first_name} ${admin.last_name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
    } else {
      console.log('❌ Admin user not found');
    }
    
    // Test regular user
    const userQuery = await client.query(
      'SELECT id, first_name, last_name, email, role FROM users WHERE email = $1',
      ['ahmet@example.com']
    );
    
    if (userQuery.rows.length > 0) {
      const user = userQuery.rows[0];
      console.log('✅ Regular user found:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.first_name} ${user.last_name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
    } else {
      console.log('❌ Regular user not found');
    }
    
    // Count total users
    const countQuery = await client.query('SELECT COUNT(*) as total FROM users');
    console.log(`📊 Total users in database: ${countQuery.rows[0].total}`);
    
    client.release();
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testDatabase(); 