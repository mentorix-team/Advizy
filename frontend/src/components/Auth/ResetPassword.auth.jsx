import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import LoginWithEmail from "./LoginWithEmail.auth";
import { resetPassword } from "../../Redux/Slices/authSlice";
import PasswordInput from "@/utils/PasswordInput/InputPassword.util";

function ResetPassword({ onClose, onSwitchView }) {
  const [password, setPassword] = useState("");
  // const { resetToken } = useParams(); // Uncomment if resetToken is needed
  const dispatch = useDispatch();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value); // Ensure you're correctly updating state
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (!password) {
      toast.error("Password is required");
      return;
    }

    // if (password.length < 8) {
    //   toast.error("Password must meet the required criteria");
    //   return;
    // }

    const response = await dispatch(resetPassword({ password }));
    if (response && response.payload && response.payload.success) {
      toast.success("Password changed successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      onSwitchView('LoginWithEmail');
    } else {
      toast.error(response?.payload?.message || "Failed to reset password"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      };
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="relative w-[820px] h-[400px] bg-white rounded-[20px] shadow-lg p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-8 text-black hover:text-black text-3xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl mb-14 font-semibold text-gray-900 text-center">
          Reset Password
        </h2>

        <p className="text-sm text-gray-700 text-center mb-6">
          Create your new password below
        </p>

        <form onSubmit={handleSubmit} className="w-80 max-w-md mx-auto">
          <div className="mb-6">
            <PasswordInput
              label="New Password"
              name="password"
              placeholder="Enter your New Password"
              value={password}
              onChange={handlePasswordChange}
              showPasswordConditions={true}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#169544] hover:bg-green-700 text-white py-2 px-4 rounded-md"
          >
            Reset Password
          </button>
        </form>

        {/* Login Link */}
        <div className="text-sm m-32 text-gray-500 text-center mt-6">
          <span>Remember your password? </span>
          <button
            className="text-[#169544] underline"
            onClick={() => onSwitchView("LoginWithEmail")}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
