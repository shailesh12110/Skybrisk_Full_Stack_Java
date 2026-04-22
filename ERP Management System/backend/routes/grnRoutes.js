import express from 'express';
import {
  getGRNs,
  getGRNById,
  createGRN,
  updateGRN,
  approveGRN,
  deleteGRN,
} from '../controllers/grnController.js';
import { protect, inventoryAccess, purchaseAccess, adminOnly, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Inventory, Purchase, and Admin can access GRNs
router.route('/')
  .get(protect, authorize('Admin', 'Inventory', 'Purchase'), getGRNs)
  .post(protect, authorize('Admin', 'Inventory', 'Purchase'), createGRN);

router
  .route('/:id')
  .get(protect, authorize('Admin', 'Inventory', 'Purchase'), getGRNById)
  .put(protect, inventoryAccess, updateGRN)
  .delete(protect, adminOnly, deleteGRN);

router.patch('/:id/approve', protect, inventoryAccess, approveGRN);

export default router;
