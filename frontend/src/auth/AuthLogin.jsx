import React, { useEffect } from "react";
import { Button } from "@nextui-org/react";

const AuthLogin = () => {
  const initiateGoogleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login");
      const data = await response.json();

      // Check if URL is returned correctly from the backend
      if (data.url) {
        window.location.href = data.url; // Redirect to Google's OAuth consent page
      } else {
        console.error("Invalid URL returned from backend");
      }
    } catch (error) {
      console.error("Error initiating Google login:", error);
    }
  };

  useEffect(() => {
    // Get the code from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Send the code to your backend
      fetch(`http://127.0.0.1:8000/auth/callback?code=${code}`)
        .then((res) => res.json())
        .then((user) => {
          console.log("Logged in user:", user);
          localStorage.setItem("user", JSON.stringify(user));
        })
        .catch((error) => {
          console.error("Login failed:", error);
        });
    }
  }, []);

  return (
    <div>
      <Button onPress={initiateGoogleLogin}>Log in with Google</Button>
    </div>
  );
};

export default AuthLogin;
