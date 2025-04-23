import axiosInstance from "@/Helperw/axiosInstance"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
    loading : false,
    error: null,
    payuData:null
}
export const PayU = createAsyncThunk(
    'payu/pay',
    async(data,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.post('payu/pay',data)
            return await response.data
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'something went wrong';
            return rejectWithValue(errorMessage)
        }
    }
)
export const success = createAsyncThunk(
    'payu/success',
    async(data,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.post('payu/success',data)
            return await response.data
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'something went wrong';
            return rejectWithValue(errorMessage)
        }
    }
)
export const failure = createAsyncThunk(
    'payu/failure',
    async(data,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.post('payu/failure',data)
            return await response.data
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'something went wrong';
            return rejectWithValue(errorMessage)
        }
    }
)
const payuSlice = createSlice(
    {
        name:'payu',
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder
            .addCase(PayU.fulfilled,(state,action)=>{
                state.loading = false
                state.payuData = action.payload
            })
            .addCase(PayU.pending,(state,action)=>{
                state.loading = true
                state.error = null
            })
            .addCase(PayU.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload.error
            })
        }
    }
)

export default payuSlice.reducer;