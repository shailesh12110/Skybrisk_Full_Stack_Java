import express from 'express';
import {
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  updatePurchaseOrderStatus,
  deletePurchaseOrder,
} from '../controllers/purchaseOrderController.js';
import { protect, purchaseAccess, adminOnly } from '../middlewares/auth.js';

const router = express.Router();

router.route('/').get(protect, purchaseAccess, getPurchaseOrders).post(protect, purchaseAccess, createPurchaseOrder);

router
  .route('/:id')
  .get(protect, purchaseAccess, getPurchaseOrderById)
  .put(protect, purchaseAccess, updatePurchaseOrder)
  .delete(protect, adminOnly, deletePurchaseOrder);

router.patch('/:id/status', protect, purchaseAccess, updatePurchaseOrderStatus);

export default router;
