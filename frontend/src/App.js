import React from "react";
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
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      {user && <StyledNavbar />}
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<AuthLogin />} />
          <Route element={<ProtectedRoute />}>
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
