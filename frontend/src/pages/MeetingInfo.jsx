import React, { act, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Divider,
  CardBody,
  Checkbox,
  Avatar,
  Button,
} from "@heroui/react";
import { useLocation } from "react-router-dom";
import { getTaskDetailsWithAI } from "../services/api";
import { useNavigate } from "react-router-dom";

const MeetingInfo = () => {
  const location = useLocation();
  const { meeting, title } = location.state || {};
  const summaryTitle = meeting.summary.split("-")[0];
  const [openTaskDrawer, setOpenTaskDrawer] = useState(false);
  const navigation = useNavigate();

  const handleJoinMeeting = () => {
    window.location.href = meeting.meet_link;
  };

  const handleCreateTask = () => {
    setOpenTaskDrawer(true);
  };

  const handlePress = (action) => {
    console.log(action);
    console.log("type of action:", typeof action);
    const response = getTaskDetailsWithAI(action);
    console.log(response);
  };

  return (
    <div className="container mx-auto pt-[65px]">
      <Button
        onClick={() => navigation(-1)} // Go back to the previous page
        className="text-base border bg-white border-red-500 text-black hover:bg-red-500 hover:text-white transition mt-4"
      >
        Back
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <Card className="bg-white shadow-md rounded p-4 col-span-2">
          <CardHeader className="text-lg font-bold mb-2">
            Programme Meeting Info for {title}
          </CardHeader>
          <CardBody>
            <Divider className="mb-2" />
            <p>{meeting.description}</p>
            <Divider className="my-2" />
            <p>{summaryTitle}</p>
          </CardBody>
        </Card>
        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">
            <div className="flex justify-between items-center w-full">
              <p>Participants</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex gap-3 items-center pt-2">
              {meeting.attendees.map((name) => (
                <Avatar key={name} name={name} />
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">
            Meeting Link
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col">
              <button
                className="text-blue-500 underline text-left"
                onClick={handleJoinMeeting}
              >
                Click here to join the meeting
              </button>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">
            Meeting Minutes
          </CardHeader>
          <CardBody>
            <Divider className="mb-2" />
            <ul>
              {meeting.meeting_minutes && meeting.meeting_minutes.length > 0 ? (
                meeting.meeting_minutes.map((minute, index) => (
                  <li key={index}>• {minute}</li>
                ))
              ) : (
                <p> No meeting minutes available </p>
              )}
            </ul>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">Tasks</CardHeader>
          <Divider />
          <CardBody>
            <ul>
              {meeting.action_items && meeting.action_items.length > 0 ? (
                meeting.action_items.map((action, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center mb-2 pr-2"
                  >
                    <span>• {action}</span>

                    <Button
                      className="text-right text-base px-4 py-1 border bg-white border-red-500 text-black hover:bg-red-500 hover:text-white transition max-w-56"
                      onClick={() => handlePress(action)}
                    >
                      Create Task
                    </Button>
                  </li>
                ))
              ) : (
                <p> No meeting minutes available </p>
              )}
            </ul>
          </CardBody>
        </Card>
      </div>
      {/* <CreateTaskDrawer /> */}
    </div>
  );
};

export default MeetingInfo;
