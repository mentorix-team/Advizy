import axiosInstance from "@/Helperw/axiosInstance"
import { createAsyncThunk, createSlice } from  "@reduxjs/toolkit"
import toast from "react-hot-toast"

const initialState = {
    availability: JSON.parse(localStorage.getItem("availability")) || {}, // Load from local storage
    selectedAvailability:null,
    loading:false,
    error:null
};

const saveToLocalStorage = (data) => {
    localStorage.setItem("availability", JSON.stringify(data));
};

export const addAvailability = createAsyncThunk(
    "availability/addavailability",
        async(data,{rejectWithValue}) => {
            try {
                const res = await axiosInstance.post('calendar/add',data)
                return res.data
            } catch (error) {
                const errorMessage =
                error?.response?.data?.message || "Failed to validate OTP.";
                toast.error(errorMessage);
                return rejectWithValue(errorMessage);
            }
        }
    
)
export const editAvailability = createAsyncThunk(
    "availability/editavailability",
        async(data,{rejectWithValue}) => {
            try {
                const res = await axiosInstance.post('calendar/edit',data)
                return res.data
            } catch (error) {
                const errorMessage =
                error?.response?.data?.message || "Failed to validate OTP.";
                toast.error(errorMessage);
                return rejectWithValue(errorMessage);
            }
        }
    
)
export const saveAvailability = createAsyncThunk(
    "availability/saveavailability",
        async(data,{rejectWithValue}) => {
            try {
                const res = await axiosInstance.post('calendar/save',data)
                return res.data
            } catch (error) {
                const errorMessage =
                error?.response?.data?.message || "Failed to validate OTP.";
                toast.error(errorMessage);
                return rejectWithValue(errorMessage);
            }
        }
    
)
export const addBlockedDates = createAsyncThunk(
    "availability/addblockeddates",
        async(data,{rejectWithValue}) => {
            try {
                const res = await axiosInstance.post('calendar/addblockeddates',data)
                return res.data
            } catch (error) {
                const errorMessage =
                error?.response?.data?.message || "Failed to validate OTP.";
                toast.error(errorMessage);
                return rejectWithValue(errorMessage);
            }
        }
)
export const addSpecificDates = createAsyncThunk(
    "availability/addspecificdates",
    async (data, { rejectWithValue }) => {
      try {
        const requestData = {
          specific_dates: data, 
        };
  
        const res = await axiosInstance.post('calendar/addspecificdates', requestData);
  
        return res.data;
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || "Failed to add specific dates.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  );
  


export const setSettings = createAsyncThunk(
    'availability/setSettings',
    async(data,{rejectWithValue}) =>{
        try {
            const res = await axiosInstance.post('calendar/set',data)
            return res.data
        } catch (error) {
            const errorMessage =
            error?.response?.data?.message || "Failed to validate OTP.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
)

export const setTimezone=createAsyncThunk(
    'availability/ssettimezone',
    async(data,{rejectWithValue}) =>{
        try {
            const res = await axiosInstance.post('calendar/settimezone',data)
            return res.data;
        } catch (error) {
            const errorMessage =
            error?.response?.data?.message || "Failed to validate OTP.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
)

export const reschedulePolicy = createAsyncThunk(
    'availability/setPolicy',
    async(data,{rejectWithValue}) =>{
        try {
            const res = await axiosInstance.post('calendar/setpolicy',data)
            return res.data;
        } catch (error) {
            const errorMessage =
            error?.response?.data?.message || "Failed to validate OTP.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
)

export const getAvailabilitybyid = createAsyncThunk(
    'availability/getavailability',
    async(id,{rejectWithValue})=>{
        try {
            const res = await axiosInstance.get(`calendar/get/${id}`)
            return res.data; 
        } catch (error) {
            const errorMessage =
            error?.response?.data?.message || "Failed to validate OTP.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
)

export const viewAvailability = createAsyncThunk(
    'availability/viewAvailability',
    async(_,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.get('calendar/view');
            console.log(response.data)
            return await response.data
        } catch (error) {
            const errorMessage =
              error?.response?.data?.message || "Failed to get the availability";
            console.error("Error in viewAvailability:", errorMessage); // Log the error
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
          }
          
    }
)

const availabilitySlice = createSlice({
    name: "availability",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(addAvailability.fulfilled, (state, action) => {
          state.availability = action.payload;
          saveToLocalStorage(state.availability); 
          toast.success("Availability added successfully!");
        })
        .addCase(saveAvailability.fulfilled, (state, action) => {
          state.availability = action.payload;
          saveToLocalStorage(state.availability); 
          toast.success("Availability saved successfully!");
        })
        .addCase(addBlockedDates.fulfilled, (state, action) => {
          state.availability = action.payload;
          saveToLocalStorage(state.availability); // Save to local storage
          toast.success("Blocked dates added successfully!");
        })
        .addCase(addSpecificDates.fulfilled, (state, action) => {
          state.availability = action.payload;
          saveToLocalStorage(state.availability); // Save to local storage
          toast.success("Specific dates added successfully!");
        })
        .addCase(setSettings.fulfilled, (state, action) => {
          state.availability = action.payload;
          saveToLocalStorage(state.availability); // Save to local storage
          toast.success("Settings updated successfully!");
        })
        .addCase(setTimezone.fulfilled, (state, action) => {
          state.availability = action.payload;
          saveToLocalStorage(state.availability); // Save to local storage
          toast.success("Timezone updated successfully!");
        })
        .addCase(reschedulePolicy.fulfilled, (state, action) => {
          state.availability = action.payload;
          saveToLocalStorage(state.availability); // Save to local storage
          toast.success("Reschedule policy updated successfully!");
        })
        .addCase(getAvailabilitybyid.fulfilled,(state,action)=>{
            state.selectedAvailability = action.payload;
            state.loading = false
        })
        .addCase(getAvailabilitybyid.pending,(state,action)=>{
            state.loading = true;
            state.error = null
        })
        .addCase(getAvailabilitybyid.rejected,(state,action)=>{
            state.error = action.payload;
            state.loading = false;
        })
        .addCase(viewAvailability.fulfilled,(state,action)=>{
            state.availability = action.payload;
            state.loading = false
        })
        .addCase(viewAvailability.pending,(state)=>{
            state.loading = true;
            state.error  =null
        })
        .addCase(viewAvailability.rejected,(state,action)=>{
            state.availability = action.payload;
            state.loading = false;
            state.error = action.payload.message 
        })
    },

  });
  

export default availabilitySlice.reducer