// src/Store/Slices/supportQueriesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// THUNK to fetch support queries
export const fetchSupportQueries = createAsyncThunk(
  "supportQueries/fetchSupportQueries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://advizy.onrender.com/api/v1/expert/support-requests",
        { withCredentials: true }  // important for sending cookies
      );
      return response.data.data; // assuming { data: [array of support queries] }
    } catch (error) {
      console.error("Error fetching support queries:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch support queries.");
    }
  }
);

const supportQueriesSlice = createSlice({
  name: "supportQueries",
  initialState: {
    queries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupportQueries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportQueries.fulfilled, (state, action) => {
        state.loading = false;
        state.queries = action.payload;
      })
      .addCase(fetchSupportQueries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default supportQueriesSlice.reducer;
