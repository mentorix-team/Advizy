    import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axiosInstance from '../../Helperw/axiosInstance'
import toast from 'react-hot-toast'

const initialState = {
    isLoggedIn:localStorage.getItem('isLoggedIn') || false,
    role:localStorage.getItem('role') || " ",
    data:localStorage.getItem('data') || {},
    expertData:localStorage.getItem('expertData') || {},
    admin_approved_expert:localStorage.getItem('admin_approved_expert') || false    
}  
export const validateToken = createAsyncThunk(
    'auth/validateToken',
    async (_, { rejectWithValue }) => {  // No need for `data` parameter
        try {
            const response = await axiosInstance.get('user/validate_token', { withCredentials: true }); // Ensure cookies are sent
            return response.data;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Please Log in Again .";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);     
export const validateOtpEmail = createAsyncThunk(
    "auth/validateOtpEmail",
    async (data, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post("user/validate_otp_email", data);
        return response.data;
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || "Failed to validate OTP.";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
      }
    }
);
export const generateOtpEmail = createAsyncThunk(
    "auth/generateOtpEmail",
    async (data, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post("user/generate_otp_for_Signup", data);
        return response.data; // Return the response for the component to handle
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || "Failed to generate OTP.";
        toast.error(errorMessage); // Show toast notification if the OTP generation fails
        return rejectWithValue(errorMessage);
      }
    }
  );
export const updateUser = createAsyncThunk(
    'user/updateUser',
    async(data,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.put('user/update',data);
            return await response.data          
        } catch (error) {
          const errorMessage =
          error?.response?.data?.message || "Failed to generate OTP.";
          toast.error(errorMessage); // Show toast notification if the OTP generation fails
          return rejectWithValue(errorMessage);
        }
    }
)
export const regenerateOtpEmail = createAsyncThunk(
    "auth/regenerateOtpEmail",
    async (data, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post("user/regenerate_otp", data);
        return response.data; // Return the response for the component to handle
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || "Failed to generate OTP.";
        toast.error(errorMessage); // Show toast notification if the OTP generation fails
        return rejectWithValue(errorMessage);
      }
    }
  );
  

export const createAccount = createAsyncThunk("auth/signup",async(data)=>{
    try {
        const res = axiosInstance.post('user/register_with_email',data)
        toast.promise(res,{
            loading:'Wait ! Authentication in progress',
            success:(data)=>{
                return data?.data?.message
            },
            error:'Failed to create Account'
        })
        return (await res).data
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})

export const createAccountwithmobile = createAsyncThunk("auth/signupWithMobile", async (data) => {
    try {
        const res = axiosInstance.post('user/register_with_mobile', data);
        toast.promise(res, {
            loading: 'Wait! Authentication in progress',
            success: (data) => {
                return data?.data?.message;
            },
            error: 'Failed to create Account with mobile'
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const getUser = createAsyncThunk("auth/user",async()=>{
    try {
        const res = axiosInstance.get('user/me',)
        console.log('result is',res);
        console.log('result data is',res.data);
        return (await res).data
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})

export const loginaccount = createAsyncThunk("auth/login",async(data)=>{
    try {
        
        const res = axiosInstance.post('user/login',data)
        toast.promise(res,{
            loading:'Wait!! Authentication in progress',
            success:(data)=>{
                // console.log(data?.data?.message )
                return data?.data?.message
            },
            error:'Failed to login'
        })
        return (await res).data
    } catch (error) {
        toast.error(error?.response?.data?.message)    
    }
})
export const logout = createAsyncThunk("auth/logout",async function(){
    try {
        const res = axiosInstance.get('user/logout');
        toast.promise(res,{
            loading : "Wait logout in progress",
            success:(data)=>{
                return data?.data?.message
            },
            error: 'Failed to logout'
        })
        return (await res).data
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})
export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email) => {
    try {
        const promise = axiosInstance.post('user/generate_otp_with_email', { email });
        
        // Use toast.promise to handle loading, success, and error states
        const res = await toast.promise(
            promise,
            {
                loading: 'Sending reset token...',
                success: (data) => data?.data?.message || 'Reset token sent to your email!',
                error: 'Failed to send reset token',
            }
        );
        
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        throw error; // Throw the error to be handled by createAsyncThunk
    }
});
export const forgotOTP = createAsyncThunk("auth/forgotOTP", async (otp, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('user/forgot_with_otp_email', { otp }); // Wrap otp in object
        toast.promise(res, {
            loading: "OTP verification in progress",
            success: (data) => {
                return data?.data?.message || "OTP Verified Successfully!";
            },
            error: "Failed to verify the OTP",
        });
        return (await res).data; // Ensure the response is returned properly
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        return rejectWithValue(error?.response?.data);
    }
});


export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ password }) => {
    try {
        const res = await axiosInstance.post(`/user/reset_pass`, { password });
        toast.promise(res, {
            loading: 'Changing password...',
            success: 'Password changed successfully!',
            error: 'Failed to change password'
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        throw new Error(error);
    }
});
export const generateOtp = createAsyncThunk("auth/generateOtp", async (data) => {
    try {
        const res = await axiosInstance.post('user/generate_otp', data);
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to generate OTP');
        throw error;
    }
});

export const loginWithOtp = createAsyncThunk("auth/loginWithOtp", async (data) => {
    try {
        const res = await axiosInstance.post('user/login_with_otp', data);
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to log in');
        throw error;
    }
});
export const forgotOtpWithEmail = createAsyncThunk("auth/forgotOtpWithEmail",async(data)=>{
    try {
        const res = await axiosInstance.post('user/forgot_with_otp',data)
        toast.promise(res,{
            loading:'Authenticating...',
            success:(data)=>data?.data?.message,
            error: 'Failed to authenticate'
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message||'Failed')
        throw error
    }
})

export const generateOtpWithEmail = createAsyncThunk("auth/generateOtpWithEmail",async(data)=>{
    try {
        const res =await axiosInstance.post('user/generate_otp_with_email',data)
        toast.promise(res,{
            loading:'Authenticating...',
            success:(data)=>data?.data?.message,
            error: 'Failed to generate otp'
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message||'Failed to generate otp ')
        throw error
    }
})
export const signupUsingMobile = createAsyncThunk(
    "auth/signupUsingMobile",
    async(data,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.post('user/signup_using_otp_mobile',data)
            return await response.data
        } catch (error) {
            toast.error(error?.response?.data?.message||'Failed to generate otp ')
            throw error   
        }
    }
)
export const validateOtpMobile = createAsyncThunk(
    "auth/validateOtpMobile",
    async(data,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.post('user/validate_otp_mobile',data)
            return await response.data
        } catch (error) {
            toast.error(error?.response?.data?.message||'Failed to generate otp ')
            throw error        
        }
    }
)
export const googleLogin = createAsyncThunk("auth/googleLogin", async (data) => {
    try {
        const { user, expert, token } = data;

        // Save data in localStorage
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", user?.role || "");
        localStorage.setItem("token", token);

        if (expert) {
            localStorage.setItem("expertData", JSON.stringify(expert));
            localStorage.setItem("admin_approved_expert", expert?.admin_approved_expert);
        }

        return { user, expert };
    } catch (error) {
        console.error("Google login error:", error);
    }
});


const authSlice = createSlice({
    name: 'auth',
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
        });
        builder.addCase(validateOtpEmail.fulfilled,(state,action)=>{
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", action?.payload?.user?.role || "");
            state.isLoggedIn = true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role ;
        });
        builder.addCase(loginaccount.fulfilled,(state,action)=>{ 
            const { user, expert } = action.payload;
            console.log("This is action.payload",action.payload)
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", user?.role || "");
            if (expert) {
                localStorage.setItem("expertData", JSON.stringify(expert));
                localStorage.setItem("admin_approved_expert", expert?.admin_approved_expert);
                // localStorage.setItem("expertToken", expert?.expertToken); // Save the expertToken
                state.expertData = expert ;
                state.admin_approved_expert = expert?.admin_approved_expert ;
            }
            state.isLoggedIn = true;
            state.data = user;
            state.role = user?.role ;
            
        });

    
        builder.addCase(logout.fulfilled, (state) => {
            localStorage.clear();
            state.data = {};
            state.isLoggedIn = false;
            state.role = "";
            state.expertData = {}
            state.admin_approved_expert = false
        });
        builder.addCase(loginWithOtp.fulfilled, (state, action) => {
            console.log("Login successful, payload received:", action.payload);
        
            if (!action.payload) return;
        
            const { user, expert } = action.payload;
            // const { user, expert } = action.payload;
            console.log("This is action.payload",action.payload)
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", user?.role || "");
            if (expert) {
                localStorage.setItem("expertData", JSON.stringify(expert));
                localStorage.setItem("admin_approved_expert", expert?.admin_approved_expert);
                // localStorage.setItem("expertToken", expert?.expertToken); // Save the expertToken
                state.expertData = expert ;
                state.admin_approved_expert = expert?.admin_approved_expert ;
            }
            state.isLoggedIn = true;
            state.data = user;
            state.role = user?.role ;
        });
        
        builder.addCase(validateOtpMobile.fulfilled,(state,action)=>{
            const {user,expert} = action.payload;
            state.isLoggedIn = true;
            state.data = user;
            state.role = user?.role ;
            state.expertData = expert ;
            state.admin_approved_expert = expert?.admin_approved_expert ;
            
        })
        

    }
});

export default authSlice.reducer