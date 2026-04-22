import express from 'express';
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplierController.js';
import { protect, purchaseAccess, adminOnly } from '../middlewares/auth.js';

const router = express.Router();

router.route('/').get(protect, purchaseAccess, getSuppliers).post(protect, purchaseAccess, createSupplier);

router
  .route('/:id')
  .get(protect, purchaseAccess, getSupplierById)
  .put(protect, purchaseAccess, updateSupplier)
  .delete(protect, adminOnly, deleteSupplier);

export default router;
