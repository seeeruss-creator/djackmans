import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

async function seed() {
  const hashed = await bcrypt.hash('admin123', 10);

  await pool.query(
    `INSERT IGNORE INTO users (id, name, username, email, password, role, status) VALUES (1, 'Admin User', 'admin', 'admin@djackman.com', ?, 'admin', 'active')`,
    [hashed]
  );

  const customers = [
    ['Maria Santos', '09171234567', 'maria@email.com', '123 Rizal St, Manila'],
    ['Juan Dela Cruz', '09189876543', 'juan@email.com', '456 Quezon Ave, Quezon City'],
    ['Ana Reyes', '09201234567', null, '789 Makati Ave, Makati'],
  ];

  for (const [name, phone, email, address] of customers) {
    await pool.query(
      'INSERT IGNORE INTO customers (name, phone, email, address) SELECT ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM customers WHERE phone = ?)',
      [name, phone, email, address, phone]
    );
  }

  const [custRows] = await pool.query('SELECT id FROM customers LIMIT 3');
  if (custRows.length >= 3) {
    const samples = [
      ['RENT-001', custRows[0].id, 'Black Tuxedo', 'L', '2025-01-10', '2025-01-15', 1500.00, 'pending'],
      ['CUST-001', custRows[1].id, 'Barong Tagalog', 'Cotton', 'pending'],
      ['REPR-001', custRows[2].id, 'Suit Jacket', 'Torn lining on left sleeve', 'pending'],
      ['DRY-001', custRows[0].id, 'Evening Gown', 2, 'pending'],
    ];

    await pool.query(
      `INSERT IGNORE INTO rent_orders (order_number, customer_id, garment_name, size, rental_start_date, rental_end_date, price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      samples[0]
    );

    await pool.query(
      `INSERT IGNORE INTO customization_orders (order_number, customer_id, garment_type, fabric_type, status)
       VALUES (?, ?, ?, ?, ?)`,
      samples[1]
    );

    await pool.query(
      `INSERT IGNORE INTO repair_orders (order_number, customer_id, garment_type, damage_description, status)
       VALUES (?, ?, ?, ?, ?)`,
      samples[2]
    );

    await pool.query(
      `INSERT IGNORE INTO drycleaning_orders (order_number, customer_id, garment_type, quantity, status)
       VALUES (?, ?, ?, ?, ?)`,
      samples[3]
    );
  }

  console.log('Seed complete. Default login: admin / admin123');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
