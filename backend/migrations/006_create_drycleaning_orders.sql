CREATE TABLE IF NOT EXISTS drycleaning_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_id INT NOT NULL,
  garment_type VARCHAR(100) NOT NULL,
  brand VARCHAR(100) NULL,
  quantity INT NOT NULL DEFAULT 1,
  price_per_item DECIMAL(10,2) NULL,
  total_price DECIMAL(10,2) NULL,
  pickup_date DATE NULL,
  status ENUM('pending','in_progress','ready_for_pickup','completed','cancelled') DEFAULT 'pending',
  notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);
