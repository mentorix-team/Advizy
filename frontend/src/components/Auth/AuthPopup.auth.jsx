import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import LoginWithEmail from "./LoginWithEmail.auth";
import LoginWithMobile from "./LoginWithMobile.auth";
import LoginWithOTP from "./LoginWithOTP.auth";
import SignupWithEmail from "./SignupWithEmail.auth";
import SignupWithMobile from "./SignupWithMobile.auth";
import ForgotPassword from "./ForgotPassword.auth";
import ForgotOTP from "./ForgotOTP.auth";
import VerifyAccount from "./VerifyAccount.auth";
import ResetPassword from "./ResetPassword.auth";
import { useSelector } from "react-redux";
import VerifyAccountMobile from "./VerifyAccountMobile.auth";

const COMPONENT_MAP = {
  LoginWithEmail,
  LoginWithMobile,
  LoginWithOTP,
  SignupWithEmail,
  SignupWithMobile,
  ForgotPassword,
  ForgotOTP,
  ResetPassword,
  VerifyAccount,
  VerifyAccountMobile,
};

const AuthPopup = ({ isOpen, onClose }) => {
  const [view, setView] = useState("LoginWithEmail");
  const { isLoggedIn } = useSelector((state) => state.auth);

  // Close popup when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      handleClosePopup();
    }
  }, [isLoggedIn]);

  const handleClosePopup = () => {
    // console.log("AuthPopup: Closing popup");
    setView("LoginWithEmail");
    onClose();

    // Small delay to allow ProtectedRoute to detect the popup was closed
    setTimeout(() => {
      // console.log("AuthPopup: Popup closed, ProtectedRoute should detect this");
    }, 100);
  };

  const handleSwitchView = (newView) => {
    // console.log("Switching View:", newView);
    setView(newView);
  };

  const ActiveComponent = COMPONENT_MAP[view];

  return (
    <Popup
      open={isOpen}
      closeOnDocumentClick={false} // Disable to prevent conflicts
      onClose={handleClosePopup}
      modal
      nested
      key={view}
    >
      <div className="auth-popup">
        {ActiveComponent && (
          <ActiveComponent
            onClose={handleClosePopup}
            onSwitchView={handleSwitchView}
          />
        )}
      </div>
    </Popup>
  );
};

export default AuthPopup;
