import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// Helper to get the token dynamically
const getAuthHeaders = () => {
  const userToken = localStorage.getItem("userToken");
  return {
    Authorization: userToken ? `Bearer ${userToken}` : "",
  };
};

// Async thunk to fetch all admin products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/products`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// New: Async thunk to fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  "adminProducts/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      // Assuming your public product route is /api/products/:id
      // If this requires admin auth, add headers: getAuthHeaders()
      const response = await axios.get(`${API_URL}/api/products/${id}`, {
        headers: getAuthHeaders(), // Added authentication for admin access
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async function to create a new product
export const createProduct = createAsyncThunk(
  "adminProducts/createProducts",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/products`, // Assuming product creation goes to /api/products
        productData,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update the product
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  // IMPORTANT: createAsyncThunk expects a single argument.
  // We pass an object containing both id and productData.
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/products/${id}`, // Corrected to match your backend PUT route
        productData,
        {
          headers: getAuthHeaders(),
          
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to delete product
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: getAuthHeaders(),
      });
      return id; // Return the ID to easily filter it out of the state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    selectedProduct: null, // New state to hold a single product for editing
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Admin Products (all products)
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })
      // Fetch Product by ID (for single product edit)
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null; // Clear previous product when fetching a new one
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload; // Store the fetched single product
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch product by ID";
      })
      // Create Product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.selectedProduct = action.payload; // Update selected product if it's the one being edited
      })
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      });
  },
});

export default adminProductSlice.reducer;