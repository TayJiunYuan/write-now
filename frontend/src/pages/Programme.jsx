import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  Divider,
  CardBody,
  Avatar,
  Button,
  Tooltip,
  Link,
} from "@heroui/react";

import {
  getMeetings,
  getUsersWithoutCredentials,
  getTasksByProgrammeId,
  getTaskFileName,
} from "../services/api";
import { CreateMeetingModal } from "../components/CreateMeetingModal";
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

  const navigation = useNavigate();

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
      return fileNames;
    } catch (error) {
      console.error("Error fetching file names:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredTasks(
      tasks.filter((task) =>
        ["BUDGET", "REPORT", "FORM"].includes(task.task_type)
      )
    );
  }, [tasks]);

  useEffect(() => {
    setIds(filteredTasks.map((task) => task.id));
    getAllFileNames(ids);
  }, [filteredTasks]);

  useEffect(() => {
    setCombinedFile(
      filteredTasks.map((task, index) => ({
        ...task,
        fileName: fileNames[index],
      }))
    );
  }, [fileNames]);

  return (
    <div className="container mx-auto min-h-screen pt-[65px]">
      <div className="my-4 space-y-4">
        <Button onPress={() => navigation(-1)} color="danger" variant="flat">
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white shadow-md rounded-xl p-4">
            <CardHeader className="text-lg font-bold">
              Programme Details
            </CardHeader>
            <div className="px-3 pb-1">
              <Divider />
            </div>
            <CardBody className="gap-1">
              <h2 className="font-medium">{event.name}</h2>
              <Divider />
              <p className="font-light">{event.description}</p>
            </CardBody>
          </Card>

          <Card className="bg-white shadow-md rounded-xl p-4">
            <CardHeader className="text-lg font-bold justify-between">
              Meetings
              <Button color="primary" size="sm" onPress={handleOpen}>
                Create Meetings
              </Button>
            </CardHeader>
            <div className="px-3 pb-1">
              <Divider />
            </div>
            <CardBody className="gap-1">
              <MeetingList meetings={meetings} title={title} />
            </CardBody>
          </Card>

          <Card className="bg-white shadow-md rounded-xl p-4">
            <CardHeader className="text-lg font-bold">People</CardHeader>
            <div className="px-3 pb-1">
              <Divider />
            </div>
            <CardBody className="gap-3">
              {Object.entries(event.groups).map(([group, ids]) => (
                <div className="flex flex-col gap-1" key={group}>
                  <p className="font-medium">{group}</p>
                  <div>
                    {ids.map((id) => {
                      const name = userLookup[id];
                      return name ? (
                        <Tooltip content={name} showArrow={true}>
                          <Avatar key={id} name={name} />
                        </Tooltip>
                      ) : (
                        <Tooltip content="No User" showArrow={true}>
                          <Avatar key={id} name={id} />
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card className="bg-white shadow-md rounded-xl p-4">
            <CardHeader className="text-lg font-bold">
              Important Files
            </CardHeader>
            <div className="px-3 pb-1">
              <Divider />
            </div>
            <CardBody className="gap-1 overflow-auto">
              {combinedFile.map((task) => (
                <Link
                  isExternal
                  showAnchorIcon
                  key={task.id}
                  color="primary"
                  underline="always"
                  href={task.task_link}
                >
                  {task.name}
                </Link>
              ))}
            </CardBody>
          </Card>
        </div>
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
