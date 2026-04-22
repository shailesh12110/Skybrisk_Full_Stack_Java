import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import customersReducer from './slices/customersSlice';
import suppliersReducer from './slices/suppliersSlice';
import salesOrdersReducer from './slices/salesOrdersSlice';
import purchaseOrdersReducer from './slices/purchaseOrdersSlice';
import grnsReducer from './slices/grnsSlice';
import invoicesReducer from './slices/invoicesSlice';
import usersReducer from './slices/usersSlice';
import dashboardReducer from './slices/dashboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    customers: customersReducer,
    suppliers: suppliersReducer,
    salesOrders: salesOrdersReducer,
    purchaseOrders: purchaseOrdersReducer,
    grns: grnsReducer,
    invoices: invoicesReducer,
    users: usersReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
