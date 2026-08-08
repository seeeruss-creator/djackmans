CREATE TABLE IF NOT EXISTS rent_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_id INT NOT NULL,
  garment_name VARCHAR(150) NOT NULL,
  size VARCHAR(20) NULL,
  rental_start_date DATE NOT NULL,
  rental_end_date DATE NOT NULL,
  rental_duration INT NULL COMMENT 'number of days',
  deposit DECIMAL(10,2) DEFAULT 0.00,
  price DECIMAL(10,2) NOT NULL,
  status ENUM('pending','ready_to_pickup','rented','returned','completed','cancelled') DEFAULT 'pending',
  notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);
