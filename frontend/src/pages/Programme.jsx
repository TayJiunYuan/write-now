import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  Divider,
  CardBody,
  Avatar,
  Button,
  Tooltip,
  Link,
  useDisclosure,
  Skeleton,
} from "@heroui/react";
import {
  getMeetings,
  getUsersWithoutCredentials,
  getTasksByProgrammeId,
  getTaskFileName,
  updateTask,
  createNewMeeting,
} from "../services/api";
import { CreateMeetingModal } from "../components/CreateMeetingModal";
import CreateTaskDrawer from "../components/CreateTaskDrawer";
import { MeetingList } from "../components/MeetingList";
import { TaskList } from "../components/TaskList";

const Programme = () => {
  // programme info variables
  const location = useLocation();
  const { event } = location.state || {};
  const title = event.name;
  const programmeID = event.id;

  // navigate back to programmes page
  const navigate = useNavigate();

  // create meeting modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // create task drawer
  const {
    isOpen: isTaskDrawerOpen,
    onOpen: onTaskDrawerOpen,
    onOpenChange: onTaskDrawerOpenChange,
  } = useDisclosure();

  // meetings, people, files
  const [meetings, setMeetings] = useState([]);
  const [users, setUsers] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [fileIds, setFileIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // tasklist
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [taskWithFileName, setTaskWithFileName] = useState([]);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [meetingsData, usersData, tasksData] = await Promise.all([
        getMeetings(programmeID),
        getUsersWithoutCredentials(),
        getTasksByProgrammeId(programmeID),
      ]);
      setMeetings(meetingsData);
      setUsers(usersData);
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [programmeID]);

  const fetchFileNames = useCallback(async (taskIds) => {
    try {
      const fileNameResponses = await Promise.all(
        taskIds.map((taskId) => getTaskFileName(taskId))
      );
      setFileNames(fileNameResponses);
    } catch (error) {
      console.error("Error fetching file names:", error);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    const filtered = tasks.filter((task) =>
      ["BUDGET", "REPORT", "FORM"].includes(task.task_type)
    );
    setFilteredTasks(filtered);
    setFileIds(filtered.map((task) => task.id));
  }, [tasks]);

  useEffect(() => {
    if (fileIds.length > 0) {
      fetchFileNames(fileIds);
    }
  }, [fileIds, fetchFileNames]);

  useEffect(() => {
    if (filteredTasks.length > 0 && fileNames.length > 0) {
      const tasksWithNames = filteredTasks.map((task, index) => ({
        ...task,
        fileName: fileNames[index],
      }));
      setTaskWithFileName(tasksWithNames);
    }
  }, [filteredTasks, fileNames]);

  const userNameLookup = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user.id] = user.name;
      return acc;
    }, {});
  }, [users]);

  const handleStatusSelect = async (task, status) => {
    try {
      // Optimistically update the local state
      const updatedTask = { ...task, status };
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
      );
      await updateTask(updatedTask);
    } catch (error) {
      console.error("Failed to update task status:", error);
      // revert state if call fails
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === task.id ? task : t))
      );
    }
  };

  const handleCreateMeeting = async (meetingData) => {
      try {
        const createdMeeting = await createNewMeeting(meetingData);
        setMeetings((prevMtgs) => [...prevMtgs, createdMeeting]);
      } catch (error) {
        console.error("Error creating meeting:", error);
        throw error;
      }
    };

  return (
    <div className="container mx-auto min-h-screen pt-[65px]">
      <div className="my-4 space-y-4">
        <Button onPress={() => navigate(-1)} color="danger" variant="flat">
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white shadow-md rounded-xl p-4">
            <CardHeader className="text-lg font-bold">
              Programme Details
            </CardHeader>
            <div className="px-3">
              <Divider />
            </div>
            <CardBody className="gap-1">
              <h2 className="font-medium">{event.name}</h2>
              <Divider />
              <p className="font-light text-gray-500 py-2">
                {event.description}
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white shadow-md rounded-xl p-4">
            <CardHeader className="text-lg font-bold justify-between">
              Upcoming Meetings
              <Button color="primary" onPress={onOpen}>
                Create Meeting
              </Button>
            </CardHeader>
            <div className="px-3">
              <Divider />
            </div>
            <Skeleton isLoaded={!loading}>
              <CardBody>
                <MeetingList meetings={meetings} title={title} />
              </CardBody>
            </Skeleton>
          </Card>

          <Card className="bg-white shadow-md rounded-xl p-4">
            <CardHeader className="text-lg font-bold">People</CardHeader>
            <div className="px-3">
              <Divider />
            </div>
            <Skeleton isLoaded={!loading}>
              <CardBody className="gap-3">
                {Object.entries(event.groups).map(([group, ids]) => (
                  <div className="flex flex-col gap-1" key={group}>
                    <p className="font-medium">{group}</p>
                    <div>
                      {ids.map((id) => {
                        const name = userNameLookup[id];
                        return name ? (
                          <Tooltip key={id} content={name} showArrow={true}>
                            <Avatar key={id} name={name} />
                          </Tooltip>
                        ) : (
                          <Tooltip key={id} content="No User" showArrow={true}>
                            <Avatar key={id} name={id} />
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardBody>
            </Skeleton>
          </Card>

          <Card className="bg-white shadow-md rounded-xl p-4">
            <CardHeader className="text-lg font-bold">
              Important Files
            </CardHeader>
            <div className="px-3">
              <Divider />
            </div>
            <Skeleton isLoaded={!loading}>
              <CardBody className="gap-1 overflow-auto w-fit">
                {taskWithFileName.map((task) => (
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
            </Skeleton>
          </Card>

          <Card className="bg-white shadow-md rounded-xl p-4 md:col-span-2">
            <CardHeader className="text-lg font-bold justify-between">
              Task List
              <Button color="primary" onPress={onTaskDrawerOpen}>
                Create Task
              </Button>
            </CardHeader>
            <div className="px-3">
              <Divider />
            </div>
            <Skeleton isLoaded={!loading}>
              <CardBody className="overflow-auto">
                <TaskList
                  tasks={tasks}
                  handleStatusSelect={handleStatusSelect}
                />
              </CardBody>
            </Skeleton>
          </Card>
        </div>
      </div>

      <CreateMeetingModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        id={programmeID}
        attendees={event.groups}
        users={users}
        handleCreateMeeting={handleCreateMeeting}
      />
      <CreateTaskDrawer
        isOpen={isTaskDrawerOpen}
        onOpenChange={onTaskDrawerOpenChange}
        definedProgrammeId={programmeID}
      />
    </div>
  );
};

export default Programme;
