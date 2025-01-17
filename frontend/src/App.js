import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";

import AuthLogin from "./auth/AuthLogin";
import ProtectedRoute from "./auth/ProtectedRoute";
import { StyledNavbar } from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Email from "./pages/Email";
import Programmes from "./pages/Programmes";
import Programme from "./pages/Programme";
import MeetingInfo from "./pages/MeetingInfo";
import TaskInfo from "./pages/TaskInfo";

const App = () => {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem("userId"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogOut = () => {
    localStorage.clear();
    setUserId(null);
  };

  return (
    <Router>
      {userId && <StyledNavbar onLogOut={handleLogOut} />}
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<AuthLogin />} />
          <Route element={<ProtectedRoute userId={userId} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/email" element={<Email />} />
            <Route path="/programmes" element={<Programmes />} />
            <Route path="/programmes/:programme_id" element={<Programme />} />
            <Route path="/meetings/:meeting_id" element={<MeetingInfo />} />
            <Route path="/tasks/:task_id" element={<TaskInfo />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
