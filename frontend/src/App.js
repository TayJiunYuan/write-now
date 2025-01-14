import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";

import { StyledNavbar } from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Email from "./pages/Email";
import Programmes from "./pages/Programmes";
import ProgrammeInfo from "./pages/ProgrammeInfo";
import MeetingInfo from "./pages/MeetingInfo";
import TaskInfo from "./pages/TaskInfo";

const App = () => {
  return (
    <Router>
      <StyledNavbar />
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/email" element={<Email />} />
          <Route path="/programmes" element={<Programmes />} />
          <Route path="/programmes/:programme_id" element={<ProgrammeInfo />} />
          <Route path="/meetings/:meeting_id" element={<MeetingInfo />} />
          <Route path="/tasks/:task_id" element={<TaskInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
