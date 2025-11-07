import axiosInstance from "@/Helperw/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  availability: JSON.parse(localStorage.getItem("availability")) || {}, // Load from local storage
  selectedAvailability: null,
  publicAvailability: null, // For expert's public availability data
  loading: false,
  error: null,
};

const saveToLocalStorage = (data) => {
  localStorage.setItem("availability", JSON.stringify(data));
};

export const addAvailability = createAsyncThunk(
  "availability/addavailability",
  async (data, { rejectWithValue }) => {
    try {
      console.log("[addAvailability] Request data:", data);
      const res = await axiosInstance.post("calendar/add", data);
      console.log("[addAvailability] Response:", res.data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to validate OTP.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(errorMessage);
    }
  }
);
export const editAvailability = createAsyncThunk(
  "availability/editavailability",
  async (data, { rejectWithValue }) => {
    try {
      console.log("[editAvailability] Request data:", data);
      const res = await axiosInstance.post("calendar/edit", data);
      console.log("[editAvailability] Response:", res.data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to validate OTP.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(errorMessage);
    }
  }
);
export const saveAvailability = createAsyncThunk(
  "availability/saveavailability",
  async (data, { rejectWithValue }) => {
    try {
      console.log("[saveAvailability] Request data:", data);
      const res = await axiosInstance.post("calendar/save", data);
      console.log("[saveAvailability] Response:", res.data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to validate OTP.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(errorMessage);
    }
  }
);
export const addBlockedDates = createAsyncThunk(
  "availability/addblockeddates",
  async (data, { rejectWithValue }) => {
    try {
      console.log("[addBlockedDates] Request data:", data);
      const res = await axiosInstance.post("calendar/addblockeddates", data);
      console.log("[addBlockedDates] Response:", res.data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to validate OTP.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeBlockedDate = createAsyncThunk(
  "availability/removeBlockedDate",
  async (dateToRemove, { rejectWithValue }) => {
    try {
      console.log("[removeBlockedDate] Request data:", dateToRemove);
      const res = await axiosInstance.post("calendar/removeblockeddates", {
        dateToRemove: dateToRemove
      });
      console.log("[removeBlockedDate] Response:", res.data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to remove blocked date.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(errorMessage);
    }
  }
);
export const addSpecificDates = createAsyncThunk(
  "availability/addspecificdates",
  async (data, { rejectWithValue }) => {
    try {
      const requestData = {
        specific_dates: data,
      };
      console.log("[addSpecificDates] Request data:", requestData);

      const res = await axiosInstance.post(
        "calendar/addspecificdates",
        requestData
      );
      console.log("[addSpecificDates] Response:", res.data);

      return res.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to add specific dates.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

export const setSettings = createAsyncThunk(
  "availability/setSettings",
  async (data, { rejectWithValue }) => {
    try {
      console.log("[setSettings] Request data:", data);
      const res = await axiosInstance.post("calendar/set", data);
      console.log("[setSettings] Response:", res.data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to validate OTP.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

export const setTimezone = createAsyncThunk(
  "availability/settimezone",
  async (data, { rejectWithValue }) => {
    try {
      console.log("[setTimezone] Request data:", data);
      const res = await axiosInstance.post("calendar/settimezone", data);
      console.log("[setTimezone] Response:", res.data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to validate OTP.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

export const reschedulePolicy = createAsyncThunk(
  "availability/setPolicy",
  async (data, { rejectWithValue }) => {
    try {
      console.log("[reschedulePolicy] Request data:", data);
      const res = await axiosInstance.post("calendar/setpolicy", data);
      console.log("[reschedulePolicy] Response:", res.data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to validate OTP.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAvailabilitybyid = createAsyncThunk(
  "availability/getavailability",
  async (id, { rejectWithValue }) => {
    try {
      console.log("[getAvailabilitybyid] Request ID:", id);
      const res = await axiosInstance.get(`calendar/get/${id}`);
      console.log("[getAvailabilitybyid] Response:", res.data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to validate OTP.";
      // toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getPublicAvailability = createAsyncThunk(
  "availability/getPublicAvailability",
  async (expertId, { rejectWithValue }) => {
    try {
      console.log("[getPublicAvailability] Request Expert ID:", expertId);
      const res = await axiosInstance.get(`calendar/get/${expertId}`);
      console.log("[getPublicAvailability] Response:", res.data);
      return res.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to fetch expert availability.";
      console.error("Error in getPublicAvailability:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const viewAvailability = createAsyncThunk(
  "availability/viewAvailability",
  async (_, { rejectWithValue }) => {
    try {
      console.log("[viewAvailability] Fetching availability data...");
      const response = await axiosInstance.get("calendar/view");
      console.log("[viewAvailability] Response:", response.data);
      return await response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to get the availability";
      console.error("Error in viewAvailability:", errorMessage); // Log the error
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

const availabilitySlice = createSlice({
  name: "availability",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAvailability.fulfilled, (state, action) => {
        console.log("[Redux] addAvailability.fulfilled - payload:", action.payload);
        state.availability = action.payload;
        saveToLocalStorage(state.availability);
        toast.success("Availability added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .addCase(saveAvailability.fulfilled, (state, action) => {
        state.availability = action.payload;
        saveToLocalStorage(state.availability);
        toast.success("Availability saved successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .addCase(addBlockedDates.fulfilled, (state, action) => {
        state.availability = action.payload;
        saveToLocalStorage(state.availability); // Save to local storage
        toast.success("Blocked dates added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .addCase(removeBlockedDate.fulfilled, (state, action) => {
        state.availability = action.payload;
        saveToLocalStorage(state.availability); // Save to local storage
        toast.success("Blocked date removed successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .addCase(addSpecificDates.fulfilled, (state, action) => {
        state.availability = action.payload;
        saveToLocalStorage(state.availability); // Save to local storage
        toast.success("Specific dates added successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .addCase(setSettings.fulfilled, (state, action) => {
        state.availability = action.payload;
        saveToLocalStorage(state.availability); // Save to local storage
        toast.success("Settings updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .addCase(setTimezone.fulfilled, (state, action) => {
        state.availability = action.payload;
        saveToLocalStorage(state.availability); // Save to local storage
        toast.success("Timezone updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .addCase(reschedulePolicy.fulfilled, (state, action) => {
        state.availability = action.payload;
        saveToLocalStorage(state.availability); // Save to local storage
        toast.success("Reschedule policy updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .addCase(getAvailabilitybyid.fulfilled, (state, action) => {
        state.selectedAvailability = action.payload;
        state.loading = false;
      })
      .addCase(getAvailabilitybyid.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailabilitybyid.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getPublicAvailability.fulfilled, (state, action) => {
        state.publicAvailability = action.payload;
        state.loading = false;
      })
      .addCase(getPublicAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublicAvailability.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(viewAvailability.fulfilled, (state, action) => {
        console.log("[Redux] viewAvailability.fulfilled - payload:", action.payload);
        state.availability = action.payload;
        state.loading = false;
      })
      .addCase(viewAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewAvailability.rejected, (state, action) => {
        state.availability = action.payload;
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default availabilitySlice.reducer;
