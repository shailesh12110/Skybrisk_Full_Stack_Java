import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  updateProductStock,
} from '../controllers/productController.js';
import { protect, inventoryAccess, adminOnly } from '../middlewares/auth.js';

const router = express.Router();

router.route('/').get(protect, getProducts).post(protect, inventoryAccess, createProduct);

router.get('/alerts/low-stock', protect, getLowStockProducts);

router
  .route('/:id')
  .get(protect, getProductById)
  .put(protect, inventoryAccess, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

router.patch('/:id/stock', protect, inventoryAccess, updateProductStock);

export default router;
