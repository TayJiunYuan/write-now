import React, { useEffect, useState } from "react";
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
import { CreateMeetingModal } from "../components/CreateMeetingModal";
import {
  getMeetings,
  getUsersWithoutCredentials,
  getTasksByProgrammeId,
  getTaskFileName,
} from "../services/api";
import { MeetingList } from "../components/MeetingList";
import { TaskList } from "../components/TaskList";

const Programme = () => {
  const location = useLocation();
  const { event } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [ids, setIds] = useState([]);
  const [users, setUsers] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [combinedFile, setCombinedFile] = useState([]);

  const title = event.name;
  const programmeID = event.id;
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [response, response1, response2] = await Promise.all([
        getMeetings(programmeID),
        getUsersWithoutCredentials(),
        getTasksByProgrammeId(programmeID),
      ]);
      setMeetings(response);
      setUsers(response1);
      setTasks(response2);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = getTasksByProgrammeId(programmeID);
      setTasks(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const userLookup = users.reduce((acc, user) => {
    acc[user.id] = user.name;
    return acc;
  }, {});

  const getAllFileNames = async (taskIds) => {
    try {
      const fileNames = await Promise.all(
        taskIds.map((taskId) => getTaskFileName(taskId))
      );
      setFileNames(fileNames);
      console.log(fileNames);
      return fileNames;
    } catch (error) {
      console.error("Error fetching file names:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(tasks);
    setFilteredTasks(
      tasks.filter((task) =>
        ["BUDGET", "REPORT", "FORM"].includes(task.task_type)
      )
    );

    console.log(filteredTasks);
  }, [tasks]);

  useEffect(() => {
    setIds(filteredTasks.map((task) => task.id));
    getAllFileNames(ids);

    console.log(filteredTasks);
  }, [filteredTasks]);

  useEffect(() => {
    setCombinedFile(
      filteredTasks.map((task, index) => ({
        ...task,
        fileName: fileNames[index],
      }))
    );
  }, [fileNames]);

  useEffect(() => {
    console.log("final:", combinedFile);
  }, [combinedFile]);

  return (
    <div className="container mx-auto min-h-screen pt-[65px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">
            Programme Details
          </CardHeader>
          <CardBody>
            <Divider />
            <h2 className="font-semibold pt-2 pb-2">{event.name}</h2>
            <Divider />
            <p className="pt-4">{event.description}</p>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">
            <div className="flex justify-between items-center w-full">
              <p>Meetings</p>
              <Button
                className="text-right text-base px-4 py-1 border bg-white border-red-500 text-black hover:bg-red-500 hover:text-white transition max-w-56"
                onPress={handleOpen}
              >
                Create Meetings
              </Button>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <MeetingList meetings={meetings} title={title} />
          </CardBody>
        </Card>

        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">People</CardHeader>
          <Divider />
          <div>
            {Object.entries(event.groups).map(([group, ids]) => (
              <div className="grid grid-cols-2" key={group}>
                <CardBody className="font-semibold">
                  {group}
                  <div className="flex gap-3 items-center pt-2">
                    {ids.map((id) => {
                      const name = userLookup[id];
                      return name ? (
                        <Avatar key={id} name={name} />
                      ) : (
                        <Avatar key={id} name={id} />
                      );
                    })}
                  </div>
                </CardBody>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">
            Important Files
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col">
              {combinedFile.map((task) => (
                <button
                  key={task.id}
                  className="text-blue-500 underline text-left"
                  onClick={() => (window.location.href = task.task_link)} // Navigate to the link
                >
                  {task.name}
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
        <TaskList tasks={tasks} fetchTask={fetchTask} />
      </div>
      <CreateMeetingModal
        isOpen={isOpen}
        onClose={handleClose}
        id={programmeID}
        attendees={event.groups}
      />
    </div>
  );
};

export default Programme;
