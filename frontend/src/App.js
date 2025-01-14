import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";

import Dashboard from "./pages/Dashboard";
import ProgrammeInfo from "./pages/ProgrammeInfo";
import Email from "./pages/Email";
import MeetingInfo from "./pages/MeetingInfo";
import TaskInfo from "./pages/TaskInfo";

const App = () => {
  return (
    <Router>
        {/* <Navbar /> */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/programme_info" element={<ProgrammeInfo />} />
            <Route path="/email" element={<Email />} />
            <Route path="/meeting_info/:meeting_id" element={<MeetingInfo />} />
            <Route path="/task_info/:task_id" element={<TaskInfo />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
