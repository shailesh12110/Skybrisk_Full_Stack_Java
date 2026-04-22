import express from 'express';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  recordPayment,
  deleteInvoice,
  getInvoiceStats,
} from '../controllers/invoiceController.js';
import { protect, salesAccess, adminOnly } from '../middlewares/auth.js';

const router = express.Router();

router.route('/').get(protect, salesAccess, getInvoices).post(protect, salesAccess, createInvoice);

router.get('/stats/overview', protect, salesAccess, getInvoiceStats);

router
  .route('/:id')
  .get(protect, salesAccess, getInvoiceById)
  .put(protect, salesAccess, updateInvoice)
  .delete(protect, adminOnly, deleteInvoice);

router.patch('/:id/payment', protect, salesAccess, recordPayment);

export default router;
