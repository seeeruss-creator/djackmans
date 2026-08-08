import pool from '../config/db.js';

const ORDER_TABLES = [
  'rent_orders',
  'customization_orders',
  'repair_orders',
  'drycleaning_orders',
];

export async function isOrderNumberTaken(orderNumber, excludeTable = null, excludeId = null) {
  const trimmed = orderNumber?.trim();
  if (!trimmed) return false;

  for (const table of ORDER_TABLES) {
    let query = `SELECT id FROM ${table} WHERE order_number = ?`;
    const params = [trimmed];

    if (table === excludeTable && excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const [rows] = await pool.query(query, params);
    if (rows.length > 0) return true;
  }

  return false;
}

export const DUPLICATE_ORDER_MESSAGE =
  'Order number already exists. Please enter a unique order number.';
