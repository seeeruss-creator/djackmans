CREATE TABLE IF NOT EXISTS customization_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_id INT NOT NULL,
  garment_type VARCHAR(100) NOT NULL,
  fabric_type VARCHAR(100) NULL,
  measurements TEXT NULL COMMENT 'JSON string or formatted text',
  design_description TEXT NULL,
  estimated_completion_date DATE NULL,
  price DECIMAL(10,2) NULL,
  status ENUM('pending','in_progress','ready_for_pickup','completed','cancelled') DEFAULT 'pending',
  notes TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);
