import axiosInstance from "@/Helperw/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";



const initialState = {
    loading:false,
    error:null,
    selectedMeeting:null,
    notifications:null,
    meetings:[],
    currentMeeting:'',
    rescheduleData:[],
}


export const createMeet = createAsyncThunk(
    'meeting/createMeet',
    async (data, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post('meeting/meet', data); // Pass the entire data object
  
        return response.data;
      } catch (error) {
        console.log(error);
        const errorMessage = error?.response?.data?.message || 'Failed to create meet.';
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  );

  export const getMeet = createAsyncThunk(
    "meeting/getMeet",
    async (data, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get("meeting/meet");
        console.log("Meeting API Response:", response);
        return response.data;
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to get meet.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  );

  export const getMeetingbyid = createAsyncThunk(
    "meeting/getmeetingbyid",
    async(id,{rejectWithValue})=>{
      try {
        const response = await axiosInstance.get(`meeting/getmeetingbyid/${id}`)
        return await response.data
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to get meet.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  )
  
  export const payed = createAsyncThunk(
    "meeting/payedformeet",
    async(data,{rejectWithValue}) =>{
      try {
        const response = await axiosInstance.post("meeting/payedformeeting",data);
        console.log("Data being sent",data)
        return response.data;
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to get meet.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  )
  

  export const getnotification = createAsyncThunk(
    "meeting/getnotified",
    async(data,{rejectWithValue}) =>{
      try {
        const response = await axiosInstance.get("meeting/getnotified")
        console.log("this is our notification data",response.data)
        return response.data
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to get meet.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      } 
    }
  )

  export const createVideoCall = createAsyncThunk(
    "meeting/createVideoCall",
    async(data,{rejectWithValue})=>{
      try {
        const response = await axiosInstance.post('meeting/createVideoCall',data)
        return await response.data 
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to get meet.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }

  )
  export const addvideoparticipant = createAsyncThunk(
    "meeting/addvideoparticipant",
    async(data,{rejectWithValue})=>{
      try {
        console.log("This is the log for creating participant",data)
        const response = await axiosInstance.post('meeting/addvideoparticipant',data)
        return await response.data 
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to add participant.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }

  )
  export const createpresetHOST = createAsyncThunk(
    "meeting/createPresetHost",
    async(data,{rejectWithValue})=>{
      try {
        const response = await axiosInstance.post('meeting/createpresetHOST',data)
        return await response.data 
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to create preset.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }

  )
  export const checkPreset = createAsyncThunk(
    "meeting/checkpreset",
    async(data,{rejectWithValue})=>{
      try {
        
        const response = await axiosInstance.post('meeting/checkpresetExists',data)
        return await response.data 
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to check .";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }

  )

  export const getMeetingByUserId = createAsyncThunk(
    "meeting/getmeetbyuserid",
    async(data,{rejectWithValue})=>{
      try {
        const response = await axiosInstance.get('meeting/meetbyuser')
        return await response.data;
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to check .";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  )
  export const getMeetingByExpertId = createAsyncThunk(
    "meeting/getmeetbyexpertid",
    async(data,{rejectWithValue})=>{
      try {
        const response = await axiosInstance.get('meeting/meetbyexpert')
        return await response.data;
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to check .";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  )
  export const fetchMeeting = createAsyncThunk(
    'meeting/fetchmeeting',
    
    async(meetingId,{rejectWithValue})=>{
      try {
        const response = await axiosInstance.get(`/meeting/fetchActiveSession/${meetingId}`)
        return await response.data
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to check .";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  )

  export const updateMeet = createAsyncThunk(
    'meeting/updatemeet',
    async(data,{rejectWithValue})=>{
      try {
        const response = await axiosInstance.post('meeting/updatemeet',data)
        return await response.data     
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to check .";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }

    }
  )

  export const updateMeetDirectly = createAsyncThunk(
    'meeting/updateDirectly',
    async(data,{rejectWithValue})=>{
      try {
        const response = await axiosInstance.post('meeting/updatemeetdirectly',data)
        return await response.data
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to check .";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  )

  export const rescheduleByExpert = createAsyncThunk(
    'meeting/reschedulebyexpert',
    async(data,{rejectWithValue})=>{
      try {
        const response  = await axiosInstance.post('meeting/rescheduleByExpert',data)
        return await response.data
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to check .";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  )
  export const verifyRescheduleToken = createAsyncThunk(
    'meeting/verifyrescheduletoken',
    async(data,{rejectWithValue})=>{
      try {
        const response = await axiosInstance.post('meeting/verifyrescheduleToken',data)
        return await response.data
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to check .";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  )

  export const getClientDetails = createAsyncThunk(
    'meeting/getclient',
    async(data,{rejectWithValue})=>{
      try {
        const response = await axiosInstance.post('meeting/getclientdetails',data);
        return await response.data
      } catch (error) {
        console.error("Error fetching meeting details:", error.response);
        const errorMessage = error?.response?.data?.message || "Failed to check .";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
  )
  const meetingSlice = createSlice({
    name:"meeting",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(createMeet.fulfilled,(state,action)=>{
                const{meeting} = action.payload
                state.selectedMeeting = meeting
            })
            .addCase(payed.fulfilled,(state,action)=>{
                const{meeting} = action.payload
                state.selectedMeeting = meeting
            })
            .addCase(getMeet.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMeet.fulfilled, (state, action) => {
                console.log('Fetched meeting:', action.payload);
                state.loading = false;
                state.selectedMeeting = action.payload.meeting;
            })
            .addCase(getMeet.rejected, (state, action) => {
                state.loading = false;
                
                state.error = action.payload;
            })
            .addCase(getMeetingbyid.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMeetingbyid.fulfilled, (state, action) => {
                console.log('Fetched meeting:', action.payload);
                state.loading = false;
                state.selectedMeeting = action.payload.meeting;
            })
            .addCase(getMeetingbyid.rejected, (state, action) => {
                state.loading = false;
                
                state.error = action.payload;
            })
            .addCase(getnotification.pending,(state,action)=>{
              state.loading = true,
              state.error = null
            })
            .addCase(getnotification.fulfilled,(state,action)=>{
              state.loading = false,
              state.notifications = action.payload.notifications
            })
            .addCase(getnotification.rejected,(state,action)=>{
              state.loading = false,
              state.error = action.payload
            })
            .addCase(getMeetingByUserId.pending,(state,action)=>{
              state.loading = true,
              state.error  = null
            })
            .addCase(getMeetingByUserId.fulfilled,(state,action)=>{
              state.loading = false,
              state.meetings  = action.payload.meeting
            })
            .addCase(getMeetingByUserId.rejected,(state,action)=>{
              state.loading = true,
              state.error  = action.payload.meeting
            })
            .addCase(getMeetingByExpertId.pending,(state,action)=>{
              state.loading = true,
              state.error  = null
            })
            .addCase(getMeetingByExpertId.fulfilled,(state,action)=>{
              state.loading = false,
              state.meetings  = action.payload.meeting
            })
            .addCase(getMeetingByExpertId.rejected,(state,action)=>{
              state.loading = true,
              state.error  = action.payload.meeting
            })
            .addCase(fetchMeeting.pending,(state,action)=>{
              state.loading = true,
              state.error = null;
            })
            .addCase(fetchMeeting.fulfilled,(state,action)=>{
              state.loading = false,
              state.currentMeeting = action.payload.data;
            })
            .addCase(fetchMeeting.rejected,(state,action)=>{
              state.loading = false,
              state.error = action.payload;
            })
            .addCase(verifyRescheduleToken.pending,(state,action)=>{
              state.loading = true,
              state.error = null
            })
            .addCase(verifyRescheduleToken.fulfilled,(state,action)=>{
              state.loading = false,
              state.rescheduleData = action.payload.data
            })
            .addCase(verifyRescheduleToken.rejected,(state,action)=>{
              state.loading = false,
              state.error = action.payload
            })
            .addCase(getClientDetails.pending,(state,action)=>{
              state.loading = true,
              state.error = null
            })
            .addCase(getClientDetails.fulfilled,(state,action)=>{
              state.loading = false,
              state.clientDetails = action.payload.user
            })
            .addCase(getClientDetails.rejected,(state,action)=>{
              state.loading = false,
              state.error = action.payload.error
            })
    },

})

export default meetingSlice.reducer;