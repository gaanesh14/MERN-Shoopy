import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";
//import { toast } from "sonner";



// Load user info from localStorage
const userFormStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

//  Initialize or generate guest ID
const initializeGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initializeGuestId);

//  Base URL from .env
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

//  Initial State
// const initialState = {
//   user: userFormStorage,
//   guestId: initializeGuestId,
//   loading: false,
//   user: null,
// };

//  Async Thunk: Login
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/users/login`, userData);
    localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    localStorage.setItem("userToken", response.data.token);
    return response.data.user;
  } catch (user) {
    return rejectWithValue(user.response?.data || { message: "Login failed" });
  }
});

//  Async Thunk: Register
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/users/register`, userData);
    localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    localStorage.setItem("userToken", response.data.token);
    return response.data.user;
  } catch (user) {

    return rejectWithValue(user.response?.data || { message: "Registration failed" });
  }
});



//  Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState:{
    user:userFormStorage,
    loading:false,
    error:null,
    loginStatus:"idle",
    guestId:localStorage.getItem("guestId") || null
  },
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId", state.guestId);
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    },
  },
  extraReducers: (builder) => {
    builder
      //  Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.loginStatus="loading",
        state.user = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loginStatus="success",
        state.user = action.payload;
       // state.user = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.loginStatus="failed",
        state.user = action.payload?.message || "Login failed";
      })

      //  Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.user = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        //state.user = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.user = action.payload?.message || "Registration failed";
      });
  },
});

export const { logOut, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
