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
} from "../services/api";
import { CreateMeetingModal } from "../components/CreateMeetingModal";
import { MeetingList } from "../components/MeetingList";
import { TaskList } from "../components/TaskList";

const Programme = () => {
  // programme info variables
  const location = useLocation();
  const { event } = location.state || {};
  const title = event.name;
  const programmeID = event.id;
  useEffect(() => {
    console.log(event);
  }, [event]);

  // navigate back to programmes page
  const navigate = useNavigate();

  // create meeting drawer
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

  return (
    <>
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
                <Button color="primary" size="sm" onPress={onOpen}>
                  Create Meetings
                </Button>
              </CardHeader>
              <div className="px-3 pb-1">
                <Divider />
              </div>
              <Skeleton isLoaded={!loading}>
                <CardBody className="gap-1">
                  <MeetingList meetings={meetings} title={title} />
                </CardBody>
              </Skeleton>
            </Card>

            <Card className="bg-white shadow-md rounded-xl p-4">
              <CardHeader className="text-lg font-bold">People</CardHeader>
              <div className="px-3 pb-1">
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
              </Skeleton>
            </Card>

            <Card className="bg-white shadow-md rounded-xl p-4">
              <CardHeader className="text-lg font-bold">
                Important Files
              </CardHeader>
              <div className="px-3 pb-1">
                <Divider />
              </div>
              <Skeleton isLoaded={!loading}>
                <CardBody className="gap-1 overflow-auto">
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
          </div>
          <Skeleton isLoaded={!loading}>
            <TaskList tasks={tasks} fetchTask={fetchTask} />
          </Skeleton>
        </div>
      </div>
      <CreateMeetingModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        id={programmeID}
        attendees={event.groups}
        users={users}
      />
    </>
  );
};

export default Programme;
