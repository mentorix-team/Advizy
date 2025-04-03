import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helperw/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  loading: false,
  error: null,
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  role: localStorage.getItem("role") || " ",
  data: localStorage.getItem("data") || {},
  expertData: localStorage.getItem("expertData") || {},
  admin_approved_expert: localStorage.getItem("admin_approved_expert") || false,
};

export const validateToken = createAsyncThunk(
  "auth/validateToken",
  async (_, { rejectWithValue }) => {
    // No need for `data` parameter
    try {
      const response = await axiosInstance.get("user/validate_token", {
        withCredentials: true,
      }); // Ensure cookies are sent
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Please log in Again .";
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

export const validateOtpEmail = createAsyncThunk(
  "auth/validateOtpEmail",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "user/validate_otp_email",
        data
      );
      return response.data;
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
export const generateOtpEmail = createAsyncThunk(
  "auth/generateOtpEmail",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "user/generate_otp_for_Signup",
        data
      );
      return response.data; // Return the response for the component to handle
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to generate OTP.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }); // Show toast notification if the OTP generation fails
      return rejectWithValue(errorMessage);
    }
  }
);
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("user/update", data);
      return await response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to generate OTP.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }); // Show toast notification if the OTP generation fails
      return rejectWithValue(errorMessage);
    }
  }
);
export const regenerateOtpEmail = createAsyncThunk(
  "auth/regenerateOtpEmail",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("user/regenerate_otp", data);
      return response.data; // Return the response for the component to handle
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to generate OTP.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }); // Show toast notification if the OTP generation fails
      return rejectWithValue(errorMessage);
    }
  }
);

export const createAccount = createAsyncThunk("auth/signup", async (data) => {
  try {
    const res = axiosInstance.post("user/register_with_email", data);
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
});

export const createAccountwithmobile = createAsyncThunk(
  "auth/signupWithMobile",
  async (data) => {
    try {
      const res = axiosInstance.post("user/register_with_mobile", data);
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }
);

export const getUser = createAsyncThunk("auth/user", async () => {
  try {
    const res = axiosInstance.get("user/me");
    console.log("result is", res);
    console.log("result data is", res.data);
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
});

export const loginaccount = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = axiosInstance.post("user/login", data);
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to Login", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout",
  async function (data, { rejectWithValue }) {
    try {
      const res = axiosInstance.get("user/logout");
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to Logout", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const promise = axiosInstance.post("user/generate_otp_with_email", {
        email,
      });

      // Use toast.promise to handle loading, success, and error states
      const res = await toast.promise(promise, {
        loading: "Sending reset token...",
        success: (data) =>
          data?.data?.message || "Reset token sent to your email!",
        error: "Failed to send reset token",
      });

      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const forgotOTP = createAsyncThunk(
  "auth/forgotOTP",
  async (otp, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("user/forgot_with_otp_email", {
        otp,
      }); // Wrap otp in object
      return (await res).data; // Ensure the response is returned properly
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/user/reset_pass`, { password });
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const generateOtp = createAsyncThunk(
  "auth/generateOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("user/generate_otp", data);
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const loginWithOtp = createAsyncThunk(
  "auth/loginWithOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("user/login_with_otp", data);
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const forgotOtpWithEmail = createAsyncThunk(
  "auth/forgotOtpWithEmail",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("user/forgot_with_otp", data);
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const generateOtpWithEmail = createAsyncThunk(
  "auth/generateOtpWithEmail",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "user/generate_otp_with_email",
        data
      );
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const signupUsingMobile = createAsyncThunk(
  "auth/signupUsingMobile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "user/signup_using_otp_mobile",
        data
      );
      return await response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const validateOtpMobile = createAsyncThunk(
  "auth/validateOtpMobile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "user/validate_otp_mobile",
        data
      );
      return await response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error?.response?.data);
    }
  }
);
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (data, { rejectWithValue }) => {
    try {
      const { user, expert, token } = data;

      // Save data in localStorage
      localStorage.setItem("data", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("role", user?.role || "");
      localStorage.setItem("token", token);

      if (expert) {
        localStorage.setItem("expertData", JSON.stringify(expert));
        localStorage.setItem(
          "admin_approved_expert",
          expert?.admin_approved_expert
        );
      }

      return { user, expert };
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong",  {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "user/refresh_token",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("user/refresh-token", data);
      return await response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong",  {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const addFavourites = createAsyncThunk(
  "user/addfavourites",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("user/favourites", data);
      return await response.data.user;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong",  {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("user/profile");
      return response.data; // This now includes full user details with favorites populated
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(googleLogin.fulfilled, (state, action) => {
      const { user, expert } = action.payload;
      state.isLoggedIn = true;
      state.data = user;
      state.role = user?.role;
      state.expertData = expert;
      state.admin_approved_expert = expert?.admin_approved_expert;
      state.loading = false;
    });
    builder.addCase(googleLogin.pending, (state, action) => {
      (state.loading = true), (state.error = null);
    });
    builder.addCase(googleLogin.rejected, (state, action) => {
      state.loading = false;
    });

    builder.addCase(validateOtpEmail.fulfilled, (state, action) => {
      localStorage.setItem("data", JSON.stringify(action?.payload?.user));
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("role", action?.payload?.user?.role || "");
      state.isLoggedIn = true;
      state.data = action?.payload?.user;
      state.role = action?.payload?.user?.role;
      state.loading = false;
    });
    builder.addCase(validateOtpEmail.pending, (state, action) => {
      (state.loading = true), (state.error = null);
    });
    builder.addCase(validateOtpEmail.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(loginaccount.pending, (state, action) => {
      (state.loading = true), (state.error = null);
    });
    builder.addCase(loginaccount.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(loginaccount.fulfilled, (state, action) => {
      const { user, expert } = action.payload;
      console.log("This is action.payload", action.payload);
      localStorage.setItem("data", JSON.stringify(action?.payload?.user));
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("role", user?.role || "");
      if (expert) {
        localStorage.setItem("expertData", JSON.stringify(expert));
        localStorage.setItem(
          "admin_approved_expert",
          expert?.admin_approved_expert
        );
        // localStorage.setItem("expertToken", expert?.expertToken); // Save the expertToken
        state.expertData = expert;
        state.admin_approved_expert = expert?.admin_approved_expert;
      }
      state.isLoggedIn = true;
      state.data = user;
      state.role = user?.role;
      state.loading = false;
    });

    builder.addCase(logout.pending, (state, action) => {
      (state.loading = true), (state.error = null);
    });

    builder.addCase(logout.fulfilled, (state, action) => {
      localStorage.clear();
      state.data = {};
      state.isLoggedIn = false;
      state.role = "";
      state.expertData = {};
      state.admin_approved_expert = false;
      (state.loading = false), (state.error = action.payload.error);
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(loginWithOtp.pending, (state, action) => {
      (state.loading = true), (state.error = null);
    });
    builder.addCase(loginWithOtp.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(loginWithOtp.fulfilled, (state, action) => {
      console.log("Login successful, payload received:", action.payload);

      if (!action.payload) return;

      const { user, expert } = action.payload;
      // const { user, expert } = action.payload;
      console.log("This is action.payload", action.payload);
      localStorage.setItem("data", JSON.stringify(action?.payload?.user));
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("role", user?.role || "");
      if (expert) {
        localStorage.setItem("expertData", JSON.stringify(expert));
        localStorage.setItem(
          "admin_approved_expert",
          expert?.admin_approved_expert
        );
        // localStorage.setItem("expertToken", expert?.expertToken); // Save the expertToken
        state.expertData = expert;
        state.admin_approved_expert = expert?.admin_approved_expert;
      }
      state.isLoggedIn = true;
      state.data = user;
      state.role = user?.role;
      state.loading = false;
    });
    builder.addCase(validateOtpMobile.pending, (state, action) => {
      (state.loading = true), (state.error = null);
    });
    builder.addCase(validateOtpMobile.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(validateOtpMobile.fulfilled, (state, action) => {
      const { user, expert } = action.payload;
      state.isLoggedIn = true;
      state.data = user;
      state.role = user?.role;
      state.expertData = expert;
      state.admin_approved_expert = expert?.admin_approved_expert;
      state.loading = false;
    });
    builder.addCase(refreshToken.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      const { user, expert } = action.payload;
      console.log("This is action.payload", action.payload);
      localStorage.setItem("data", JSON.stringify(action?.payload?.user));
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("role", user?.role || "");
      if (expert) {
        localStorage.setItem("expertData", JSON.stringify(expert));
        localStorage.setItem(
          "admin_approved_expert",
          expert?.admin_approved_expert
        );
        // localStorage.setItem("expertToken", expert?.expertToken); // Save the expertToken
        state.expertData = expert;
        state.admin_approved_expert = expert?.admin_approved_expert;
      }
      state.isLoggedIn = true;
      state.data = user;
      state.role = user?.role;
      state.loading = false;
    });
    builder.addCase(refreshToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    });

    builder.addCase(addFavourites.fulfilled, (state, action) => {
      state.data = action.payload.user;
    });

    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.data = action.payload; // Store updated user data in Redux
    });
  },
});

export default authSlice.reducer;
