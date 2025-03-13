import axiosInstance from "@/Helperw/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  loading: false,
  error: null,
  paymentDetails: null,
  paymentVerified: false,
};

// Action to create payment order
export const createpaymentOrder = createAsyncThunk(
  "payment/createorder",
  async (data, { rejectWithValue }) => {
    console.log("createpaymentOrder called with data:", data);
    try {
      const response = await axiosInstance.post('payment/create-order', data);
      console.log("createpaymentOrder response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in createpaymentOrder:", error.response);
      const errorMessage = error?.response?.data?.message || "Failed to create payment.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifypaymentOrder = createAsyncThunk(
  "payment/verifypayment",
  async (data, { rejectWithValue }) => {
    console.log("verifypaymentOrder called with data:", data);

    if (!data.razorpay_payment_id || !data.razorpay_order_id || !data.razorpay_signature) {
      console.error('Missing required data for payment verification');
      return rejectWithValue("Missing required data for payment verification.");
    }

    try {
      const response = await axiosInstance.post('payment/verify-payment', data);
      console.log("verifypaymentOrder response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in verifypaymentOrder:", error.response);
      const errorMessage = error?.response?.data?.message || "Failed to verify payment.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const initiatePayout = createAsyncThunk(
  "expert/initiatepayot",
  async(data,{rejectWithValue})=>{
    try {
      const response = await axiosInstance.post('payment/initiate-payout',data);
      return response.data;
    } catch (error) {
      console.error("Error in verifypaymentOrder:", error.response);
      const errorMessage = error?.response?.data?.message || "Failed to initiate payout.";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
)

// Payment slice with logs in reducers
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle the states for the createpaymentOrder action
    builder
      .addCase(createpaymentOrder.pending, (state) => {
        console.log("createpaymentOrder.pending triggered");
        state.loading = true;
        state.error = null;
      })
      .addCase(createpaymentOrder.fulfilled, (state, action) => {
        console.log("createpaymentOrder.fulfilled triggered with payload:", action.payload);
        state.loading = false;
        state.paymentDetails = action.payload; // Store the payment details in the state
        state.error = null;
      })
      .addCase(createpaymentOrder.rejected, (state, action) => {
        console.log("createpaymentOrder.rejected triggered with error:", action.payload);
        state.loading = false;
        state.error = action.payload;
        state.paymentDetails = null;
      });

    // Handle the states for the verifypaymentOrder action
    builder
      .addCase(verifypaymentOrder.pending, (state) => {
        console.log("verifypaymentOrder.pending triggered");
        state.loading = true;
        state.error = null;
      })
      .addCase(verifypaymentOrder.fulfilled, (state, action) => {
        console.log("verifypaymentOrder.fulfilled triggered with payload:", action.payload);
        state.loading = false;
        state.paymentVerified = true; // Mark the payment as verified
        state.error = null;
      })
      .addCase(verifypaymentOrder.rejected, (state, action) => {
        console.log("verifypaymentOrder.rejected triggered with error:", action.payload);
        state.loading = false;
        state.error = action.payload;
        state.paymentVerified = false;
      });
  }
});

export default paymentSlice.reducer;
