import axiosInstance from "@/Helperw/axiosInstance"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
    loading: false,
    error: null,
    payuData: null,
    verificationResult: null
}

export const PayU = createAsyncThunk(
    'payu/pay',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('payu/pay', data)
            return response.data
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'something went wrong';
            return rejectWithValue(errorMessage)
        }
    }
)

export const verifyPayment = createAsyncThunk(
    'payu/verify',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('payu/verify', data)
            return response.data
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'something went wrong';
            return rejectWithValue(errorMessage)
        }
    }
)

export const success = createAsyncThunk(
    'payu/success',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('payu/success', data);
            
            // Check if the response is a redirect
            if (response.status === 302 || response.status === 307) {
                // Extract the redirect URL from the Location header
                const redirectUrl = response.headers.location;
                if (redirectUrl) {
                    // Return the redirect URL to be handled in the component
                    return { redirectUrl };
                }
            }
            
            // If the server returns JSON with a redirectUrl (if you implement the server changes)
            if (response.data && response.data.redirectUrl) {
                return { redirectUrl: response.data.redirectUrl };
            }
            
            return response.data;
        } catch (error) {
            // Check if the error is a redirect (some versions of Axios handle redirects as errors)
            if (error.response && (error.response.status === 302 || error.response.status === 307)) {
                const redirectUrl = error.response.headers.location;
                if (redirectUrl) {
                    return { redirectUrl };
                }
            }
            
            const errorMessage = error?.response?.data?.message || 'something went wrong';
            return rejectWithValue(errorMessage);
        }
    }
)

export const failure = createAsyncThunk(
    'payu/failure',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('payu/failure', data)
            return response.data
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'something went wrong';
            return rejectWithValue(errorMessage)
        }
    }
)

const payuSlice = createSlice({
    name: 'payu',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(PayU.fulfilled, (state, action) => {
                state.loading = false
                state.payuData = action.payload
            })
            .addCase(PayU.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(PayU.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.loading = false
                state.verificationResult = action.payload
            })
            .addCase(verifyPayment.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(success.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(success.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(success.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(failure.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(failure.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(failure.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export default payuSlice.reducer;