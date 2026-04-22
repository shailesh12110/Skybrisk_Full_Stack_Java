import { createSlice } from '@reduxjs/toolkit';

export default createSlice({ name: 'invoices', initialState: { items: [], item: null, pagination: null, isLoading: false }, reducers: {} }).reducer;
