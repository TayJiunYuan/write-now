import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignIn from "./components/SignIn";

const AuthLogin = () => {
  const navigate = useNavigate();

  const initiateGoogleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login");
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Google's OAuth consent page in a new tab
      } else {
        console.error("Invalid URL returned from backend");
      }
    } catch (error) {
      console.error("Error initiating Google login:", error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("user_id");

    if (userId) {
      localStorage.setItem("userId", userId);
      navigate("/dashboard");
    }
  }, []);

  return <SignIn initiateGoogleLogin={initiateGoogleLogin} />;
};

export default AuthLogin;
