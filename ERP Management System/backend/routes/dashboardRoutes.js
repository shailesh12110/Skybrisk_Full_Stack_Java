import express from 'express';
import {
  getDashboardOverview,
  getSalesTrends,
  getTopProducts,
  getTopCustomers,
  getRecentActivities,
  getInventoryAlerts,
} from '../controllers/dashboardController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/overview', protect, getDashboardOverview);
router.get('/sales-trends', protect, getSalesTrends);
router.get('/top-products', protect, getTopProducts);
router.get('/top-customers', protect, getTopCustomers);
router.get('/recent-activities', protect, getRecentActivities);
router.get('/inventory-alerts', protect, getInventoryAlerts);

export default router;
