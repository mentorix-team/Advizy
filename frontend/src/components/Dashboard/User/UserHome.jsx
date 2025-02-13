import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AuthPopup from "../../Auth/AuthPopup.auth.jsx";
import { logout } from "@/Redux/Slices/authSlice.js";

const UserHome = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [isAuthPopupOpen, setAuthPopupOpen] = useState(false);

  const handleOpenAuthPopup = () => {
    setAuthPopupOpen(true);
  };

  const handleCloseAuthPopup = () => {
    setAuthPopupOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };
  

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <p>Welcome to the User Dashboard Home Page!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>Please log in to access your dashboard.</p>
          <button onClick={handleOpenAuthPopup}>Login / Signup</button>
        </div>
      )}
      <AuthPopup isOpen={isAuthPopupOpen} onClose={handleCloseAuthPopup} />
    </div>
  );
};

export default UserHome;
