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
    setView("LoginWithEmail");
    onClose();
  };

  const handleSwitchView = (newView) => {
    console.log("Switching View:", newView);
    setView(newView);
  };

  const ActiveComponent = COMPONENT_MAP[view];

  return (
    <Popup
      open={isOpen}
      closeOnDocumentClick
      onClose={handleClosePopup}
      modal
      nested
      key={view} // Re-render on view change
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
