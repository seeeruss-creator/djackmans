CREATE TABLE IF NOT EXISTS repair_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_id INT NOT NULL,
  garment_type VARCHAR(100) NOT NULL,
  damage_description TEXT NOT NULL,
  damage_level VARCHAR(50) NULL,
  size VARCHAR(20) NULL,
  estimated_completion_date DATE NULL,
  price DECIMAL(10,2) NULL,
  status ENUM('pending','in_progress','ready_for_pickup','completed','cancelled') DEFAULT 'pending',
  notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);
