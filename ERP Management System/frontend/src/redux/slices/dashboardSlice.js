import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  overview: null,
  salesTrends: [],
  topProducts: [],
  topCustomers: [],
  recentActivities: [],
  inventoryAlerts: null,
  isLoading: false,
};

export const getDashboardOverview = createAsyncThunk('dashboard/getOverview', async (_, thunkAPI) => {
  try {
    const response = await api.get('/dashboard/overview');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const getSalesTrends = createAsyncThunk('dashboard/getSalesTrends', async (period, thunkAPI) => {
  try {
    const response = await api.get(`/dashboard/sales-trends?period=${period}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardOverview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.overview = action.payload;
      })
      .addCase(getSalesTrends.fulfilled, (state, action) => {
        state.salesTrends = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
