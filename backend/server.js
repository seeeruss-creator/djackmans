import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { createOrderRoutes } from './routes/orderRoutes.js';
import { RentOrderController } from './controllers/RentOrderController.js';
import { CustomizationOrderController } from './controllers/CustomizationOrderController.js';
import { RepairOrderController } from './controllers/RepairOrderController.js';
import { DryCleaningOrderController } from './controllers/DryCleaningOrderController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/rent-orders', createOrderRoutes(RentOrderController));
app.use('/api/customization-orders', createOrderRoutes(CustomizationOrderController));
app.use('/api/repair-orders', createOrderRoutes(RepairOrderController));
app.use('/api/dry-cleaning-orders', createOrderRoutes(DryCleaningOrderController));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
