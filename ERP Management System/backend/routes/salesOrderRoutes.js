import express from 'express';
import {
  getSalesOrders,
  getSalesOrderById,
  createSalesOrder,
  updateSalesOrder,
  updateSalesOrderStatus,
  deleteSalesOrder,
} from '../controllers/salesOrderController.js';
import { protect, salesAccess, adminOnly } from '../middlewares/auth.js';

const router = express.Router();

router.route('/').get(protect, salesAccess, getSalesOrders).post(protect, salesAccess, createSalesOrder);

router
  .route('/:id')
  .get(protect, salesAccess, getSalesOrderById)
  .put(protect, salesAccess, updateSalesOrder)
  .delete(protect, adminOnly, deleteSalesOrder);

router.patch('/:id/status', protect, salesAccess, updateSalesOrderStatus);

export default router;
