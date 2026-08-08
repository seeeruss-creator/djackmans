import pool from '../config/db.js';

export const CustomerModel = {
  async findAll(search = '') {
    let query = 'SELECT * FROM customers';
    const params = [];
    if (search) {
      query += ' WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?';
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [id]);
    return rows[0];
  },

  async create(data) {
    try {
      const [result] = await pool.query(
        'INSERT INTO customers (name, phone, email, address, notes) VALUES (?, ?, ?, ?, ?)',
        [data.name, data.phone, data.email || null, data.address || null, data.notes || null]
      );
      return this.findById(result.insertId);
    } catch (err) {
      if (err.code === 'ER_BAD_FIELD_ERROR') {
        const [result] = await pool.query(
          'INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)',
          [data.name, data.phone, data.email || null, data.address || null]
        );
        return this.findById(result.insertId);
      }
      throw err;
    }
  },

  async update(id, data) {
    try {
      await pool.query(
        'UPDATE customers SET name = ?, phone = ?, email = ?, address = ?, notes = ? WHERE id = ?',
        [data.name, data.phone, data.email || null, data.address || null, data.notes || null, id]
      );
    } catch (err) {
      if (err.code === 'ER_BAD_FIELD_ERROR') {
        await pool.query(
          'UPDATE customers SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?',
          [data.name, data.phone, data.email || null, data.address || null, id]
        );
      } else {
        throw err;
      }
    }
    return this.findById(id);
  },

  async getOrderHistory(customerId) {
    const queries = [
      [`SELECT id, order_number, status, created_at, 'rental' AS service_type FROM rent_orders WHERE customer_id = ?`, customerId],
      [`SELECT id, order_number, status, created_at, 'customization' AS service_type FROM customization_orders WHERE customer_id = ?`, customerId],
      [`SELECT id, order_number, status, created_at, 'repair' AS service_type FROM repair_orders WHERE customer_id = ?`, customerId],
      [`SELECT id, order_number, status, created_at, 'dry_cleaning' AS service_type FROM drycleaning_orders WHERE customer_id = ?`, customerId],
    ];
    try {
      const rich = [
        [`SELECT id, order_number, status, payment_status, delivery_status, total_amount, created_at, 'rental' AS service_type FROM rent_orders WHERE customer_id = ?`, customerId],
        [`SELECT id, order_number, status, payment_status, delivery_status, total_amount, created_at, 'customization' AS service_type FROM customization_orders WHERE customer_id = ?`, customerId],
        [`SELECT id, order_number, status, payment_status, delivery_status, total_amount, created_at, 'repair' AS service_type FROM repair_orders WHERE customer_id = ?`, customerId],
        [`SELECT id, order_number, status, payment_status, delivery_status, total_amount, created_at, 'dry_cleaning' AS service_type FROM drycleaning_orders WHERE customer_id = ?`, customerId],
      ];
      const results = await Promise.all(rich.map(([q, id]) => pool.query(q, [id])));
      return results.flatMap(([rows]) => rows).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch {
      const results = await Promise.all(queries.map(([q, id]) => pool.query(q, [id])));
      return results.flatMap(([rows]) => rows).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  },

  async delete(id) {
    const tables = ['rent_orders', 'customization_orders', 'repair_orders', 'drycleaning_orders'];
    for (const table of tables) {
      const [rows] = await pool.query(`SELECT id FROM ${table} WHERE customer_id = ? LIMIT 1`, [id]);
      if (rows.length > 0) return { blocked: true };
    }
    await pool.query('DELETE FROM customers WHERE id = ?', [id]);
    return { blocked: false };
  },
};

export const UserModel = {
  async findAll() {
    const [rows] = await pool.query(
      'SELECT id, name, username, email, role, status, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, username, email, role, status, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  },

  async create(data) {
    const [result] = await pool.query(
      'INSERT INTO users (name, username, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [data.name, data.username, data.email, data.password, data.role || 'clerk', data.status || 'active']
    );
    return this.findById(result.insertId);
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name); }
    if (data.username !== undefined) { fields.push('username = ?'); params.push(data.username); }
    if (data.email !== undefined) { fields.push('email = ?'); params.push(data.email); }
    if (data.password !== undefined) { fields.push('password = ?'); params.push(data.password); }
    if (data.role !== undefined) { fields.push('role = ?'); params.push(data.role); }
    if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }
    if (fields.length === 0) return this.findById(id);
    params.push(id);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  },

  async delete(id) {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
  },
};

function garmentColumn(table) {
  if (table === 'rent_orders') return 'o.garment_name';
  return 'o.garment_type';
}

function buildOrderListQuery(table, search, status, paymentStatus = '', deliveryStatus = '') {
  let query = `
    SELECT o.*, c.name AS customer_name, c.phone AS customer_phone,
           c.email AS customer_email, c.address AS customer_address, c.notes AS customer_notes
    FROM ${table} o
    JOIN customers c ON o.customer_id = c.id
    WHERE 1=1
  `;
  const params = [];
  if (search) {
    const garment = garmentColumn(table);
    query += ` AND (o.order_number LIKE ? OR c.name LIKE ? OR c.phone LIKE ? OR ${garment} LIKE ?)`;
    const term = `%${search}%`;
    params.push(term, term, term, term);
  }
  if (status) {
    query += ' AND o.status = ?';
    params.push(status);
  }
  if (paymentStatus) {
    query += ' AND o.payment_status = ?';
    params.push(paymentStatus);
  }
  if (deliveryStatus) {
    query += ' AND o.delivery_status = ?';
    params.push(deliveryStatus);
  }
  query += ' ORDER BY o.created_at DESC';
  return { query, params };
}

function createOrderModel(table) {
  return {
    async findAll(search = '', status = '', paymentStatus = '', deliveryStatus = '') {
      const { query, params } = buildOrderListQuery(table, search, status, paymentStatus, deliveryStatus);
      const [rows] = await pool.query(query, params);
      return rows;
    },

    async findById(id) {
      const [rows] = await pool.query(
        `SELECT o.*, c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email, c.address AS customer_address, c.notes AS customer_notes
         FROM ${table} o JOIN customers c ON o.customer_id = c.id WHERE o.id = ?`,
        [id]
      );
      return rows[0];
    },

    async create(data, columns, values) {
      const [result] = await pool.query(
        `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
        values
      );
      return this.findById(result.insertId);
    },

    async update(id, sets, values) {
      await pool.query(`UPDATE ${table} SET ${sets.join(', ')} WHERE id = ?`, [...values, id]);
      return this.findById(id);
    },

    async delete(id) {
      await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
    },
  };
}

export const RentOrderModel = createOrderModel('rent_orders');
export const CustomizationOrderModel = createOrderModel('customization_orders');
export const RepairOrderModel = createOrderModel('repair_orders');
export const DryCleaningOrderModel = createOrderModel('drycleaning_orders');

const PENDING_STATUSES = ['received', 'in_progress', 'ready_for_pickup', 'pending', 'rented', 'ready_to_pickup'];

export const DashboardModel = {
  async getStats() {
    const tables = [
      { key: 'rental', table: 'rent_orders', label: 'Rental' },
      { key: 'customization', table: 'customization_orders', label: 'Customization' },
      { key: 'repair', table: 'repair_orders', label: 'Repair' },
      { key: 'dry_cleaning', table: 'drycleaning_orders', label: 'Dry Cleaning' },
    ];

    const counts = await Promise.all(
      tables.map(async ({ key, table, label }) => {
        const [[total]] = await pool.query(`SELECT COUNT(*) AS count FROM ${table}`);
        const [[pending]] = await pool.query(
          `SELECT COUNT(*) AS count FROM ${table} WHERE status IN (${PENDING_STATUSES.map(() => '?').join(',')}) AND status != 'cancelled' AND status != 'completed'`,
          PENDING_STATUSES
        );
        const [byStatus] = await pool.query(
          `SELECT status, COUNT(*) AS count FROM ${table} GROUP BY status`
        );
        return {
          key,
          label,
          total: total.count,
          pending: pending.count,
          byStatus: Object.fromEntries(byStatus.map((r) => [r.status, r.count])),
        };
      })
    );

    const totalOrders = counts.reduce((s, c) => s + c.total, 0);
    const pendingOrders = counts.reduce((s, c) => s + c.pending, 0);

    const recentQueries = await Promise.all(
      tables.map(({ key, table, label }) =>
        pool.query(
          `SELECT o.id, o.order_number, o.status, o.payment_status, o.delivery_status, o.created_at,
                  c.name AS customer_name, ? AS service_type, ? AS service_label
           FROM ${table} o
           JOIN customers c ON c.id = o.customer_id
           ORDER BY o.created_at DESC
           LIMIT 5`,
          [key, label]
        )
      )
    );

    const recentOrders = recentQueries
      .flatMap(([rows]) => rows)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 8);

    return {
      totalOrders,
      pendingOrders,
      totalRentOrders: counts.find((c) => c.key === 'rental')?.total || 0,
      totalCustomizationOrders: counts.find((c) => c.key === 'customization')?.total || 0,
      totalRepairOrders: counts.find((c) => c.key === 'repair')?.total || 0,
      totalDryCleaningOrders: counts.find((c) => c.key === 'dry_cleaning')?.total || 0,
      byType: counts,
      chart: counts.map((c) => ({
        type: c.label,
        received: (c.byStatus.received || 0) + (c.byStatus.pending || 0),
        in_progress: (c.byStatus.in_progress || 0) + (c.byStatus.rented || 0),
        ready_for_pickup: (c.byStatus.ready_for_pickup || 0) + (c.byStatus.ready_to_pickup || 0),
        completed: (c.byStatus.completed || 0) + (c.byStatus.returned || 0),
        cancelled: c.byStatus.cancelled || 0,
      })),
      recentOrders,
    };
  },

  async getReports({ from = null, to = null } = {}) {
    const tables = [
      { key: 'rental', table: 'rent_orders', amountCol: 'COALESCE(total_amount, price, 0)' },
      { key: 'customization', table: 'customization_orders', amountCol: 'COALESCE(total_amount, price, 0)' },
      { key: 'repair', table: 'repair_orders', amountCol: 'COALESCE(total_amount, price, 0)' },
      { key: 'dry_cleaning', table: 'drycleaning_orders', amountCol: 'COALESCE(total_amount, total_price, 0)' },
    ];

    const dateFilter = (alias = 'o') => {
      const clauses = [];
      const params = [];
      if (from) {
        clauses.push(`DATE(${alias}.created_at) >= ?`);
        params.push(from);
      }
      if (to) {
        clauses.push(`DATE(${alias}.created_at) <= ?`);
        params.push(to);
      }
      return { sql: clauses.length ? ` AND ${clauses.join(' AND ')}` : '', params };
    };

    let totalOrders = 0;
    let revenue = 0;
    let paidAmount = 0;
    let outstanding = 0;
    let completed = 0;
    let pending = 0;
    let cancelled = 0;
    const byService = {};
    const byStatus = {};

    for (const { key, table, amountCol } of tables) {
      const df = dateFilter('o');
      const [rows] = await pool.query(
        `SELECT status,
                COUNT(*) AS count,
                SUM(${amountCol}) AS revenue,
                SUM(COALESCE(amount_paid, 0)) AS paid,
                SUM(COALESCE(balance, ${amountCol} - COALESCE(amount_paid, 0), 0)) AS outstanding
         FROM ${table} o
         WHERE 1=1${df.sql}
         GROUP BY status`,
        df.params
      );

      let serviceTotal = 0;
      for (const row of rows) {
        const count = Number(row.count) || 0;
        serviceTotal += count;
        totalOrders += count;
        revenue += Number(row.revenue) || 0;
        paidAmount += Number(row.paid) || 0;
        outstanding += Number(row.outstanding) || 0;
        byStatus[row.status] = (byStatus[row.status] || 0) + count;
        if (row.status === 'completed' || row.status === 'returned') completed += count;
        else if (row.status === 'cancelled') cancelled += count;
        else pending += count;
      }
      byService[key] = serviceTotal;
    }

    return {
      totalOrders,
      revenue: Number(revenue.toFixed(2)),
      paidAmount: Number(paidAmount.toFixed(2)),
      outstandingBalance: Number(Math.max(0, outstanding).toFixed(2)),
      completedOrders: completed,
      pendingOrders: pending,
      cancelledOrders: cancelled,
      ordersByServiceType: byService,
      ordersByStatus: byStatus,
      from,
      to,
    };
  },
};
