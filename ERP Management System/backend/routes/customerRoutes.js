import express from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController.js';
import { protect, salesAccess, adminOnly } from '../middlewares/auth.js';

const router = express.Router();

router.route('/').get(protect, salesAccess, getCustomers).post(protect, salesAccess, createCustomer);

router
  .route('/:id')
  .get(protect, salesAccess, getCustomerById)
  .put(protect, salesAccess, updateCustomer)
  .delete(protect, adminOnly, deleteCustomer);

export default router;
