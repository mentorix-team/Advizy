import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/Helperw/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  expertData: (() => {
    const data = localStorage.getItem("expertData");
    try {
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Error parsing expertData from localStorage:", error);
      return {};
    }
  })(),
  admin_approved_expert: (() => {
    const data = localStorage.getItem("admin_approved_expert");
    try {
      return data ? JSON.parse(data) : false;
    } catch (error) {
      console.error(
        "Error parsing admin_approved_expert from localStorage:",
        error
      );
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

export const expertImages = createAsyncThunk(
  "expert/expertimages",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/expert/basic-image-details",
        data
      );
      return await response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error.response?.data);
    }
  }
);

export const basicFormSubmit = createAsyncThunk(
  "expert/basicform",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Response being sent", data);
      const response = await axiosInstance.post("/expert/basic-details", data);
      return await response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error.response?.data);
    }
  }
);

export const professionalFormSubmit = createAsyncThunk(
  "expert/professionalForm",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "expert/credentials-details",
        data
      );
      return await response.data;
    } catch (error) {
      toast.error(error.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error.response?.data);
    }
  }
);

export const ExperienceFormSubmit = createAsyncThunk(
  "expert/experienceForm",
  async (data, { rejectWithValue }) => {
    try {
      const isFormData = data instanceof FormData;
      const response = await axiosInstance.post(
        "/expert/expertExperience",
        data,
        isFormData
          ? {
              headers: { "Content-Type": "multipart/form-data" },
            }
          : {}
      );

      return response.data; // Assuming the backend returns the desired response
    } catch (error) {
      console.error("Error submitting experience form:", error);

      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const editExperience = createAsyncThunk(
  "expert/editExperience",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/expert/editExpertExperience",
        data
      );
      return response?.data;
    } catch (error) {
      console.error("Error submitting experience form:", error);

      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const deleteExpertExperience = createAsyncThunk(
  "expert/deleteexpertexperience",
  async (data, { rejectWithValue }) => {
    console.log("data,", data);
    try {
      const isFormData = data instanceof FormData;
      const response = await axiosInstance.post(
        "/expert/deleteExpertExperience",
        data,
        isFormData
          ? {
              headers: { "Content-Type": "multipart/form-data" },
            }
          : {}
      );
      return await response.data;
    } catch (error) {
      console.error("Error submitting experience form:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const PaymentFormSubmit = createAsyncThunk(
  "expert/paymentForm",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/expert/expertPayment", data);
      return await response.data;
    } catch (error) {
      console.error("Error submitting payment form:", error);

      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const EducationFormSubmit = createAsyncThunk(
  "expert/educationForm",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/expert/singleexpertEducation",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting education form:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const EditEducationForm = createAsyncThunk(
  "expert/editEducation",
  async (data, { rejectWithValue }) => {
    try {
      console.log("this is in slice", data);
      const response = await axiosInstance.post(
        "/expert/editExpertEducation",
        data
      );
      return await response?.data;
    } catch (error) {
      console.error("Error submitting education form:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const deleteEducation = createAsyncThunk(
  "expert/deleteExpertEducation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "expert/deleteExpertEducation",
        data
      );
      return await response.data;
    } catch (error) {
      console.error("Error submitting education form:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const SingleEducationForm = createAsyncThunk(
  "expert/singleeducationform",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/expert/singleexpertEducation",
        data
      );
      return res.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const CertificateForm = createAsyncThunk(
  "expert/certificateForm",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("expert/expertCertificate", data);
      return res.data;
    } catch (error) {
      console.error("Error submitting certificate form:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const EditCertificate = createAsyncThunk(
  "expert/editCertificate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("expert/editExpertCerti", data);
      return response?.data;
    } catch (error) {
      console.error("Error submitting certificate form:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const deleteCerti = createAsyncThunk(
  "expert/delete",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "expert/deleteExpertCerti",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting certificate form:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const PortfolioForm = createAsyncThunk(
  "expert/portfolioform",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("expert/portfolio-details", data);
      return res.data;
    } catch (error) {
      console.error("Error submitting portfolio form:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const submitExpertForm = createAsyncThunk(
  "expert/finalPreviewForm",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("expert/updateExpertDetails", data);
      return res.data;
    } catch (error) {
      console.error("Error submitting portfolio form:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

// export const getAllExperts = createAsyncThunk(
//   "expert/get",
//   async (queryParams = {}, { rejectWithValue }) => {
//     try {
//       const queryParamsWithApproval = {
//         ...queryParams,
//         admin_approved_expert: true,
//       };

//       // Construct query string dynamically
//       const queryString = new URLSearchParams(
//         queryParamsWithApproval
//       ).toString();
//       const endpoint = queryString
//         ? `expert/getexperts?${queryString}`
//         : "expert/getexperts";

//       const { data } = await axiosInstance.get(endpoint);

//       // Check if response.data is an array
//       const experts = Array.isArray(data.data) ? data.data : [];

//       // Filter approved experts
//       const approvedExperts = experts.filter(
//         (expert) => expert?.admin_approved_expert === true
//       );

//       console.log("Fetched Experts:", {
//         total: experts.length,
//         approved: approvedExperts.length,
//       });

//       // const approvedExperts = data.filter(
//       //   (expert) => expert.admin_approved_expert === true
//       // );
//       console.log(approvedExperts);
//       return approvedExperts;
//     } catch (error) {
//       console.error("Error fetching experts:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         "Failed to fetch experts. Please try again.";
//       toast.error(errorMessage, {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//       return rejectWithValue(error.response?.data || { message: errorMessage });
//     }
//   }
// );

export const getAllExperts = createAsyncThunk(
  "expert/get",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const queryParamsWithApproval = {
        ...queryParams,
        admin_approved_expert: true,
      };

      const queryString = new URLSearchParams(
        queryParamsWithApproval
      ).toString();
      const endpoint = `expert/getexperts?${queryString}`;

      const response = await axiosInstance.get(endpoint);

      const expertsData = response.data?.experts || [];
      // console.log("API Response:", response.data);
      return expertsData;
    } catch (error) {
      console.error("Error fetching experts:", error);
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch experts",
        details: error.response?.data,
      });
    }
  }
);

export const getServiceWithExpertByServiceId = createAsyncThunk(
  "expert/getServiceWithExpertByServiceId",
  async (serviceId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`expert/${serviceId}`);
      return response.data; // { service, expert }
    } catch (error) {
      const errorMessage = toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
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
      const response = await axiosInstance.get(
        `/expert/getexpert/by-url/${redirect_url}`
      );
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const expertServiceForm = createAsyncThunk(
  "expert/expertServiceForm",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("expert/service", data);
    } catch (error) {
      console.error("Error submitting Service form:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const createService = createAsyncThunk(
  "expert/createexpertservice",

  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("expert/createservice", data);
      return response.data;
    } catch (error) {
      console.error("Error submitting Service form:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const createFeature = createAsyncThunk(
  "expert/createexpertfeature",

  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("expert/createfeature", data);
      return response.data;
    } catch (error) {
      console.error("Error submitting Feature form:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const getServices = createAsyncThunk(
  "expert/getServices",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("expert/getServices");
      return response.data;
    } catch (error) {
      console.error("Error submitting Feature form:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const deleteService = createAsyncThunk(
  "expert/deleteService",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("expert/service", {
        params: { serviceId: data.serviceId }, // Pass the serviceId as a query parameter
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const deleteServicebyId = createAsyncThunk(
  "expert/deleteService",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("expert/deleteService", data);
      return await response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const updateServicebyId = createAsyncThunk(
  "expert/updateService",
  async (data, { rejectWithValue }) => {
    try {
      console.log("this is data  sent", data);
      const response = await axiosInstance.post("expert/updateService", data);
      return await response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const generateOtpforValidating = createAsyncThunk(
  "expert/generateotpforvalidating",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "expert/generateotpforvalidating",
        data
      );
      return await response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const validatetheotp = createAsyncThunk(
  "expert/validatingotp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("expert/verifyingotpgot", data);
      return await response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const toggleService = createAsyncThunk(
  "expert/handletoggleService",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("expert/handletoggle", data);
      return await response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const getmeasexpert = createAsyncThunk(
  "expert/getmeas",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("expert/getmeasexpert");
      return await response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

const expertSlice = createSlice({
  name: "expert",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(expertImages.fulfilled, (state, action) => {
        console.log("Thi si s action", action.payload);
        const expert = action.payload.expertbasic;
        console.log("This is expert:", expert);

        const adminApproved = expert?.admin_approved_expert ?? false; // Default to false if undefined
        localStorage.setItem("expertData", JSON.stringify(expert));
        localStorage.setItem("admin_approved_expert", adminApproved);

        state.expertData = expert;
        state.admin_approved_expert = adminApproved;
        state.loading = false;
      })
      .addCase(expertImages.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(expertImages.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload.error);
      })
      .addCase(basicFormSubmit.fulfilled, (state, action) => {
        console.log("Thi si s action", action.payload);
        const expert = action.payload.expertbasic;
        console.log("This is expert:", expert);

        const adminApproved = expert?.admin_approved_expert ?? false; // Default to false if undefined
        localStorage.setItem("expertData", JSON.stringify(expert));
        localStorage.setItem("admin_approved_expert", adminApproved);

        state.expertData = expert;
        state.admin_approved_expert = adminApproved;
        state.loading = false;
      })
      .addCase(basicFormSubmit.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(basicFormSubmit.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload);
      })
      .addCase(professionalFormSubmit.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(professionalFormSubmit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(professionalFormSubmit.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.loading = false;
        state.expertData = expert;
      })
      .addCase(ExperienceFormSubmit.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(ExperienceFormSubmit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(ExperienceFormSubmit.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.loading = false;
        state.expertData = expert;
      })
      .addCase(PaymentFormSubmit.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(PaymentFormSubmit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(PaymentFormSubmit.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.loading = false;
        state.expertData = expert;
      })

      .addCase(SingleEducationForm.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(SingleEducationForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(SingleEducationForm.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.loading = false;
        state.expertData = expert;
      })
      .addCase(CertificateForm.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(CertificateForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(CertificateForm.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.loading = false;
        state.expertData = expert;
      })
      .addCase(PortfolioForm.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(PortfolioForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(PortfolioForm.fulfilled, (state, action) => {
        const { expert } = action.payload;
        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));
        // Update Redux state
        state.loading = false;
        state.expertData = expert;
      })
      .addCase(createService.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        const { expert } = action.payload;
        localStorage.setItem("expertData", JSON.stringify(expert));
        state.expertData = expert;
      })
      .addCase(getAllExperts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(getAllExperts.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.experts = action.payload; // Store the array of experts
      // })
      .addCase(getAllExperts.fulfilled, (state, action) => {
        if (action.payload.length > 0 || state.experts.length === 0) {
          state.experts = action.payload;
        }
        state.loading = false;
        state.error = null;
        console.log("Updated state.experts:", state.experts);
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

      .addCase(getServices.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(getServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.services = action.payload;
        state.loading = false;
      })
      .addCase(getServicebyid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServicebyid.fulfilled, (state, action) => {
        console.log("this is action payload okk", action.payload);
        state.loading = false;
        state.selectedService = action.payload.service;
        state.selectedExpert = action.payload.expert;
      })
      .addCase(getServicebyid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Something went wrong";
      })

      .addCase(getServiceWithExpertByServiceId.fulfilled, (state, action) => {
        state.selectedExpert = action.payload.expert;
        state.selectedService = action.payload.service;
      })
      .addCase(getServiceWithExpertByServiceId.rejected, (state, action) => {
        console.error("Fetch failed:", action.payload);
      })

      .addCase(deleteServicebyId.fulfilled, (state, action) => {
        const { expert } = action.payload;
        localStorage.setItem("expertData", JSON.stringify(expert));
        state.expertData = expert;
        state.loading = false;
      })
      .addCase(deleteServicebyId.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteServicebyId.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(toggleService.fulfilled, (state, action) => {
        const { expert } = action.payload;
        state.expertData = expert;
        state.loading = false;
      })
      .addCase(toggleService.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(toggleService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateServicebyId.fulfilled, (state, action) => {
        const { expert } = action.payload;
        localStorage.setItem("expertData", JSON.stringify(expert));
        state.expertData = expert;
        state.loading = false;
      })
      .addCase(updateServicebyId.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(updateServicebyId.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(getmeasexpert.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(getmeasexpert.fulfilled, (state, action) => {
        state.expertData = action.payload.expert;
        state.loading = false;
      })
      .addCase(getmeasexpert.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload.error);
      })

      .addCase(EditEducationForm.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.loading = false;
        state.expertData = expert;
      })
      .addCase(EditEducationForm.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(EditEducationForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      .addCase(deleteEducation.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.loading = false;
        state.expertData = expert;
      })
      .addCase(deleteEducation.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

      .addCase(EditCertificate.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.loading = false;
        state.expertData = expert;
      })
      .addCase(EditCertificate.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(EditCertificate.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload.error);
      })

      .addCase(deleteCerti.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.loading = false;
        state.expertData = expert;
      })
      .addCase(deleteCerti.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(deleteCerti.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload.error);
      })

      .addCase(editExperience.fulfilled, (state, action) => {
        const { expert } = action.payload;

        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.loading = false;
        state.expertData = expert;
      })
      .addCase(editExperience.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(editExperience.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload.error);
      })

      .addCase(deleteExpertExperience.fulfilled, (state, action) => {
        console.log("action,", action.payload);
        const { expert } = action.payload;
        // Save to localStorage
        localStorage.setItem("expertData", JSON.stringify(expert));

        // Update Redux state
        state.loading = false;
        state.expertData = expert;
      })
      .addCase(deleteExpertExperience.pending, (state, action) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(deleteExpertExperience.rejected, (state, action) => {
        (state.loading = false), (state.error = action.payload.error);
      });
  },
});

export default expertSlice.reducer;
