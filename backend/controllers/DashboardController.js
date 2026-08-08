import { DashboardModel } from '../models/index.js';

function isDbConnectionError(err) {
  return (
    err.code === 'ECONNREFUSED' ||
    err.code === 'PROTOCOL_CONNECTION_LOST' ||
    /ECONNREFUSED|connect/i.test(err.message || '')
  );
}

function emptyDashboardStats() {
  return {
    totalOrders: 0,
    pendingOrders: 0,
    totalRentOrders: 0,
    totalCustomizationOrders: 0,
    totalRepairOrders: 0,
    totalDryCleaningOrders: 0,
    chart: [
      { type: 'Rental', received: 0, in_progress: 0, ready_for_pickup: 0, completed: 0, cancelled: 0 },
      { type: 'Customization', received: 0, in_progress: 0, ready_for_pickup: 0, completed: 0, cancelled: 0 },
      { type: 'Repair', received: 0, in_progress: 0, ready_for_pickup: 0, completed: 0, cancelled: 0 },
      { type: 'Dry Cleaning', received: 0, in_progress: 0, ready_for_pickup: 0, completed: 0, cancelled: 0 },
    ],
    recentOrders: [],
  };
}

function emptyReports(from = null, to = null) {
  return {
    totalOrders: 0,
    revenue: 0,
    paidAmount: 0,
    outstandingBalance: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    ordersByServiceType: {
      rental: 0,
      customization: 0,
      repair: 0,
      dry_cleaning: 0,
    },
    ordersByStatus: {},
    from,
    to,
  };
}

export const DashboardController = {
  async stats(req, res) {
    try {
      const data = await DashboardModel.getStats();
      res.json({ success: true, data });
    } catch (err) {
      if (isDbConnectionError(err)) {
        return res.json({ success: true, data: emptyDashboardStats() });
      }

      res.status(500).json({ success: false, message: 'Unable to load dashboard statistics.' });
    }
  },

  async reports(req, res) {
    let start = req.query.from || null;
    let end = req.query.to || null;
    try {
      const { from, to, range } = req.query;
      const today = new Date();
      const iso = (d) => d.toISOString().slice(0, 10);

      if (range === 'today') {
        start = iso(today);
        end = iso(today);
      } else if (range === 'week') {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        start = iso(weekStart);
        end = iso(today);
      } else if (range === 'month') {
        start = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        end = iso(today);
      }

      const data = await DashboardModel.getReports({ from: start, to: end });
      res.json({ success: true, data });
    } catch (err) {
      if (isDbConnectionError(err)) {
        return res.json({ success: true, data: emptyReports(start, end) });
      }

      res.status(500).json({ success: false, message: 'Unable to load reports.' });
    }
  },
};
