import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';

const createEntitySlice = (name, endpoint) => {
  const initialState = {
    items: [],
    item: null,
    pagination: null,
    isLoading: false,
    isError: false,
    message: '',
  };

  const getAll = createAsyncThunk(`${name}/getAll`, async (params, thunkAPI) => {
    try {
      const response = await api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  });

  const getById = createAsyncThunk(`${name}/getById`, async (id, thunkAPI) => {
    try {
      const response = await api.get(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  });

  const create = createAsyncThunk(`${name}/create`, async (data, thunkAPI) => {
    try {
      const response = await api.post(endpoint, data);
      toast.success(`${name} created successfully!`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  });

  const update = createAsyncThunk(`${name}/update`, async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`${endpoint}/${id}`, data);
      toast.success(`${name} updated successfully!`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  });

  const remove = createAsyncThunk(`${name}/delete`, async (id, thunkAPI) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      toast.success(`${name} deleted successfully!`);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  });

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      reset: (state) => {
        state.isLoading = false;
        state.isError = false;
        state.message = '';
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(getAll.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getAll.fulfilled, (state, action) => {
          state.isLoading = false;
          state.items = action.payload[Object.keys(action.payload)[0]];
          state.pagination = action.payload.pagination;
        })
        .addCase(getAll.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })
        .addCase(getById.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getById.fulfilled, (state, action) => {
          state.isLoading = false;
          state.item = action.payload;
        })
        .addCase(getById.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })
        .addCase(create.fulfilled, (state, action) => {
          state.items.unshift(action.payload);
        })
        .addCase(update.fulfilled, (state, action) => {
          const index = state.items.findIndex(i => i._id === action.payload._id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        })
        .addCase(remove.fulfilled, (state, action) => {
          state.items = state.items.filter(i => i._id !== action.payload);
        });
    },
  });

  return {
    reducer: slice.reducer,
    actions: { ...slice.actions, getAll, getById, create, update, remove },
  };
};

// Suppliers
const suppliersSliceObj = createEntitySlice('suppliers', '/suppliers');
export const suppliersActions = suppliersSliceObj.actions;
export default suppliersSliceObj.reducer;
