ALTER TABLE customers ADD COLUMN notes TEXT NULL;

ALTER TABLE rent_orders ADD COLUMN brand VARCHAR(100) NULL;
ALTER TABLE rent_orders ADD COLUMN color VARCHAR(100) NULL;
ALTER TABLE rent_orders ADD COLUMN fabric VARCHAR(100) NULL;
ALTER TABLE rent_orders ADD COLUMN quantity INT NOT NULL DEFAULT 1;
ALTER TABLE rent_orders ADD COLUMN description TEXT NULL;
ALTER TABLE rent_orders ADD COLUMN special_instructions TEXT NULL;
ALTER TABLE rent_orders ADD COLUMN order_date DATE NULL;
ALTER TABLE rent_orders ADD COLUMN due_date DATE NULL;
ALTER TABLE rent_orders ADD COLUMN additional_charges DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE rent_orders ADD COLUMN discount DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE rent_orders ADD COLUMN total_amount DECIMAL(10,2) NULL;
ALTER TABLE rent_orders ADD COLUMN amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE rent_orders ADD COLUMN balance DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE rent_orders ADD COLUMN payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid';
ALTER TABLE rent_orders ADD COLUMN delivery_status VARCHAR(30) NOT NULL DEFAULT 'pending';

ALTER TABLE customization_orders ADD COLUMN color VARCHAR(100) NULL;
ALTER TABLE customization_orders ADD COLUMN style VARCHAR(100) NULL;
ALTER TABLE customization_orders ADD COLUMN quantity INT NOT NULL DEFAULT 1;
ALTER TABLE customization_orders ADD COLUMN embellishments TEXT NULL;
ALTER TABLE customization_orders ADD COLUMN special_instructions TEXT NULL;
ALTER TABLE customization_orders ADD COLUMN order_date DATE NULL;
ALTER TABLE customization_orders ADD COLUMN due_date DATE NULL;
ALTER TABLE customization_orders ADD COLUMN additional_charges DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE customization_orders ADD COLUMN discount DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE customization_orders ADD COLUMN total_amount DECIMAL(10,2) NULL;
ALTER TABLE customization_orders ADD COLUMN amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE customization_orders ADD COLUMN balance DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE customization_orders ADD COLUMN payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid';
ALTER TABLE customization_orders ADD COLUMN delivery_status VARCHAR(30) NOT NULL DEFAULT 'pending';

ALTER TABLE repair_orders ADD COLUMN repair_type VARCHAR(150) NULL;
ALTER TABLE repair_orders ADD COLUMN required_work TEXT NULL;
ALTER TABLE repair_orders ADD COLUMN quantity INT NOT NULL DEFAULT 1;
ALTER TABLE repair_orders ADD COLUMN special_instructions TEXT NULL;
ALTER TABLE repair_orders ADD COLUMN order_date DATE NULL;
ALTER TABLE repair_orders ADD COLUMN due_date DATE NULL;
ALTER TABLE repair_orders ADD COLUMN additional_charges DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE repair_orders ADD COLUMN discount DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE repair_orders ADD COLUMN total_amount DECIMAL(10,2) NULL;
ALTER TABLE repair_orders ADD COLUMN amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE repair_orders ADD COLUMN balance DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE repair_orders ADD COLUMN payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid';
ALTER TABLE repair_orders ADD COLUMN delivery_status VARCHAR(30) NOT NULL DEFAULT 'pending';

ALTER TABLE drycleaning_orders ADD COLUMN cleaning_instructions TEXT NULL;
ALTER TABLE drycleaning_orders ADD COLUMN stain_description TEXT NULL;
ALTER TABLE drycleaning_orders ADD COLUMN special_instructions TEXT NULL;
ALTER TABLE drycleaning_orders ADD COLUMN order_date DATE NULL;
ALTER TABLE drycleaning_orders ADD COLUMN due_date DATE NULL;
ALTER TABLE drycleaning_orders ADD COLUMN additional_charges DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE drycleaning_orders ADD COLUMN discount DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE drycleaning_orders ADD COLUMN total_amount DECIMAL(10,2) NULL;
ALTER TABLE drycleaning_orders ADD COLUMN amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE drycleaning_orders ADD COLUMN balance DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE drycleaning_orders ADD COLUMN payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid';
ALTER TABLE drycleaning_orders ADD COLUMN delivery_status VARCHAR(30) NOT NULL DEFAULT 'pending';

ALTER TABLE rent_orders MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'received';
ALTER TABLE customization_orders MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'received';
ALTER TABLE repair_orders MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'received';
ALTER TABLE drycleaning_orders MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'received';

UPDATE rent_orders SET status = 'received' WHERE status IN ('pending');
UPDATE rent_orders SET status = 'ready_for_pickup' WHERE status IN ('ready_to_pickup');
UPDATE rent_orders SET status = 'in_progress' WHERE status IN ('rented');
UPDATE rent_orders SET status = 'completed' WHERE status IN ('returned');
UPDATE customization_orders SET status = 'received' WHERE status = 'pending';
UPDATE repair_orders SET status = 'received' WHERE status = 'pending';
UPDATE drycleaning_orders SET status = 'received' WHERE status = 'pending';

UPDATE rent_orders SET total_amount = COALESCE(price, 0) + COALESCE(additional_charges, 0) - COALESCE(discount, 0), balance = GREATEST(0, COALESCE(price, 0) + COALESCE(additional_charges, 0) - COALESCE(discount, 0) - COALESCE(amount_paid, 0)) WHERE total_amount IS NULL;
UPDATE customization_orders SET total_amount = COALESCE(price, 0) + COALESCE(additional_charges, 0) - COALESCE(discount, 0), balance = GREATEST(0, COALESCE(price, 0) + COALESCE(additional_charges, 0) - COALESCE(discount, 0) - COALESCE(amount_paid, 0)) WHERE total_amount IS NULL;
UPDATE repair_orders SET total_amount = COALESCE(price, 0) + COALESCE(additional_charges, 0) - COALESCE(discount, 0), balance = GREATEST(0, COALESCE(price, 0) + COALESCE(additional_charges, 0) - COALESCE(discount, 0) - COALESCE(amount_paid, 0)) WHERE total_amount IS NULL;
UPDATE drycleaning_orders SET total_amount = COALESCE(total_price, COALESCE(price_per_item, 0) * COALESCE(quantity, 1), 0) + COALESCE(additional_charges, 0) - COALESCE(discount, 0), balance = GREATEST(0, COALESCE(total_price, COALESCE(price_per_item, 0) * COALESCE(quantity, 1), 0) + COALESCE(additional_charges, 0) - COALESCE(discount, 0) - COALESCE(amount_paid, 0)) WHERE total_amount IS NULL;
