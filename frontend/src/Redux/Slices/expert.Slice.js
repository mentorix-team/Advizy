import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/Helperw/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  expertData: (() => {
    const data = localStorage.getItem('expertData');
    try {
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Error parsing expertData from localStorage:", error);
      return {};
    }
  })(),
  admin_approved_expert: (() => {
    const data = localStorage.getItem('admin_approved_expert');
    try {
      return data ? JSON.parse(data) : false;
    } catch (error) {
      console.error("Error parsing admin_approved_expert from localStorage:", error);
      return false;
    }
  })(),
  experts: [],
  selectedExpert: null,
  loading: false,
  error: null,
  services: [],
  selectedService: null,
};


export const basicFormSubmit = createAsyncThunk(
  "expert/basicform",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/expert/basic-details", data);
      return await response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data);
      
    }
  }
);

export const professionalFormSubmit = createAsyncThunk(
    'expert/professionalForm',
    async(data,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.post('expert/credentials-details',data);
            return await response.data;
        } catch (error) {
            toast.error(error.response?.data?.message);
            return rejectWithValue(error.response?.data);
        }
    }
)

export const ExperienceFormSubmit = createAsyncThunk(
  'expert/experienceForm',
  async (data, { rejectWithValue }) => {
    try {
      const isFormData = data instanceof FormData;
      const response = await axiosInstance.post(
        '/expert/expertExperience',data,
        isFormData
          ? {
              headers: { 'Content-Type': 'multipart/form-data' },
            }
          : {}
      );

      return response.data; // Assuming the backend returns the desired response
    } catch (error) {
      console.error("Error submitting experience form:", error);

      toast.error(error.response?.data?.message || "Something went wrong");

      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const PaymentFormSubmit = createAsyncThunk(
  'expert/paymentForm',
  async(data,{rejectWithValue}) =>{
    try {
      const response = await axiosInstance.post('/expert/expertPayment',data)
      return await response.data;
      
    } catch (error) {
      console.error("Error submitting payment form:", error);

      toast.error(error.response?.data?.message || "Something went wrong");

      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
    

  }
)

export const EducationFormSubmit = createAsyncThunk(
  "expert/educationForm",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/expert/singleexpertEducation", data);
      return response.data;
    } catch (error) {
      console.error("Error submitting education form:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);


export const SingleEducationForm = createAsyncThunk(
  "expert/singleeducationform",
  async(data,{rejectWithValue})=>{
    try {
      const res = await axiosInstance.post("/expert/singleexpertEducation",data)
      return res.data
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
      return rejectWithValue(
        error.response.data
      )
    }
  }
) 

export const CertificateForm = createAsyncThunk(
  "expert/certificateForm",
  async (data,{rejectWithValue})=>{
    try {
      const res = await axiosInstance.post('expert/expertCertificate',data)
      return res.data;
    } catch (error) {
      console.error("Error submitting certificate form:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
)

export const PortfolioForm = createAsyncThunk(
  "expert/portfolioform",
  async(data,{rejectWithValue}) =>{
    try {
      const res = await axiosInstance.post('expert/portfolio-details',data)
      return res.data;
    } catch (error) {
      console.error("Error submitting portfolio form:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      )
    }
  }
)

export const submitExpertForm = createAsyncThunk(
  "expert/finalPreviewForm",
  async(data,{rejectWithValue})=>{
    try {
      const res = await axiosInstance.post('expert/updateExpertDetails',data)
      return res.data
    } catch (error) {
      console.error("Error submitting portfolio form:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      )
    }
  }
) 


export const getAllExperts = createAsyncThunk(
  'expert/get',
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      // Construct query string dynamically
      const queryString = new URLSearchParams(queryParams).toString();
      const endpoint = queryString ? `expert/getexperts?${queryString}` : 'expert/getexperts';

      const { data } = await axiosInstance.get(endpoint);
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching experts:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch experts. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue(error.response?.data || { message: errorMessage });
    }
  }
);


export const getExpertById = createAsyncThunk(
  "expert/getExpertById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/expert/getexpert/${id}`);
      console.log("API Response:", response.data); 
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const getExpertByRedirectUrl = createAsyncThunk(
  "expert/getExpertbyRedirectUrl",
  async (redirect_url, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/expert/getexpert/by-url/${redirect_url}`);
      console.log("API Response:", response.data); 
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const expertServiceForm = createAsyncThunk(
  'expert/expertServiceForm',
  async(data,{rejectWithValue})=>{
    try {
      const response  = await axiosInstance.post('expert/service',data)
    } catch (error) {
      console.error("Error submitting Service form:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      ) 
    }
  }
)

export const createService = createAsyncThunk(
  "expert/createexpertservice",

  async(data,{rejectWithValue}) =>{
    try {
      const response = await axiosInstance.post('expert/createservice',data);
      return response.data;
    } catch (error) {
      console.error("Error submitting Service form:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      ) 
    }
  }
)
export const createFeature = createAsyncThunk(
  "expert/createexpertfeature",

  async(data,{rejectWithValue}) =>{
    try {
      const response = await axiosInstance.post('expert/createfeature',data);
      return response.data;
    } catch (error) {
      console.error("Error submitting Feature form:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      ) 
    }
  }
)

export const getServices = createAsyncThunk(
  "expert/getServices",
  async(data,{rejectWithValue})=>{
    try {
      const response = await axiosInstance.get('expert/getServices')
      return response.data;
    } catch (error) {
      console.error("Error submitting Feature form:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      )  
    }
  }
)

export const deleteService = createAsyncThunk(
  "expert/deleteService",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete('expert/service', {
        params: { serviceId: data.serviceId }, // Pass the serviceId as a query parameter
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const getServicebyid = createAsyncThunk(
  "expert/getServicebyid",
  async ({ serviceId, expertId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`expert/service/${serviceId}`, {
        expertId, 
      });

      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      return rejectWithValue(error?.response?.data || { message: "Unknown error occurred" });
    }
  }
);
export const deleteServicebyId = createAsyncThunk(
  "expert/deleteService",
  async(data,{rejectWithValue})=>{
    try {
      const response = await axiosInstance.post('expert/deleteService',data)
      return await response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      return rejectWithValue(error?.response?.data || { message: "Unknown error occurred" });
    }
  }
)
export const updateServicebyId = createAsyncThunk(
  "expert/updateService",
  async(data,{rejectWithValue})=>{
    try {
      console.log('this is data  sent',data);
      const response = await axiosInstance.post('expert/updateService',data)
      return await response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      return rejectWithValue(error?.response?.data || { message: "Unknown error occurred" });
    }
  }
)

export const generateOtpforValidating = createAsyncThunk(
  'expert/generateotpforvalidating',
  async(data,{rejectWithValue})=>{
    try {
      const response = await axiosInstance.post('expert/generateotpforvalidating',data)
      return await response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      return rejectWithValue(error?.response?.data || { message: "Unknown error occurred" });
    }
  }
)

export const validatetheotp = createAsyncThunk(
  'expert/validatingotp',
  async(data,{rejectWithValue})=>{
    try {
      const response = await axiosInstance.post('expert/verifyingotpgot',data)
      return await response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      return rejectWithValue(error?.response?.data || { message: "Unknown error occurred" });
    }
  }
)







const expertSlice = createSlice({
  name: "expert",
  initialState,
  reducers: {},
  
  extraReducers: (builder) => {
    builder
    .addCase(basicFormSubmit.fulfilled, (state, action) => {
      console.log("Thi si s action",action.payload)
      const  expert  = action.payload.expertbasic;
      console.log("This is expert:", expert);

      const adminApproved = expert?.admin_approved_expert ?? false; // Default to false if undefined
      localStorage.setItem("expertData", JSON.stringify(expert));
      localStorage.setItem("admin_approved_expert", adminApproved);

      state.expertData = expert;
      state.admin_approved_expert = adminApproved;
    })
    .addCase(basicFormSubmit.pending, (state, action) => {
        state.loading = true,
        state.error = null
    })
    .addCase(basicFormSubmit.rejected, (state, action) => {
      state.loading = false,
      state.error = action.payload
    })
      .addCase(professionalFormSubmit.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.expertData = expert;
      })
      .addCase(ExperienceFormSubmit.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.expertData = expert;
      })
      .addCase(PaymentFormSubmit.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.expertData = expert;
      })
      .addCase(SingleEducationForm.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.expertData = expert;
      })
      .addCase(CertificateForm.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.expertData = expert;
      })
      .addCase(PortfolioForm.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.expertData = expert;
      })

      .addCase(createService.fulfilled,(state,action) =>{
        const {expert} = action.payload;
        localStorage.setItem("expertData",JSON.stringify(expert))
        state.expertData = expert;
      })
      
      .addCase(getAllExperts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllExperts.fulfilled, (state, action) => {
        state.loading = false;
        state.experts = action.payload; // Store the array of experts
      })
      .addCase(getAllExperts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error fetching experts";
      })
      .addCase(getExpertById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExpertById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExpert = action.payload; // Store the expert data
      })
      .addCase(getExpertById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching expert by ID";
      })
      .addCase(getExpertByRedirectUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExpertByRedirectUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExpert = action.payload; // Store the expert data
      })
      .addCase(getExpertByRedirectUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching expert by ID";
      })
      .addCase(getServices.fulfilled,(state,action)=>{
        state.services = action.payload;
      })
      .addCase(getServicebyid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServicebyid.fulfilled, (state, action) => {
        console.log("this is action payload okk",action.payload)
        state.loading = false;
        state.selectedService = action.payload.service; 
        state.selectedExpert = action.payload.expert; 
      })
      .addCase(getServicebyid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Something went wrong';
      })
      .addCase(deleteServicebyId.fulfilled, (state, action) => {
        const { expert } = action.payload;
        localStorage.setItem("expertData", JSON.stringify(expert));
        state.expertData = expert;

      })
      .addCase(deleteServicebyId.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateServicebyId.fulfilled, (state, action) => {
        const { expert } = action.payload;
        localStorage.setItem("expertData", JSON.stringify(expert));
        state.expertData = expert;

      })
      .addCase(updateServicebyId.rejected, (state, action) => {
        state.error = action.payload;
      })
  }
});



export default expertSlice.reducer;
