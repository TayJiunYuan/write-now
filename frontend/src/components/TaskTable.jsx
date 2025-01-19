import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import {
  getTasksByUserId,
  getUsersWithoutCredentials,
  getAllProgrammes,
  getTasksByTaskId,
  deleteTask,
} from "../services/api";
import { columns, statusColors } from "../constants/TableElements";
import { EyeIcon, EditIcon, DeleteIcon } from "../constants/Icons";
import CreateTaskDrawer from "./CreateTaskDrawer";

export const TaskTable = () => {
  const [allUserTasks, setAllUserTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [res1, res2, res3] = await Promise.all([
          getTasksByUserId(userId),
          getUsersWithoutCredentials(),
          getAllProgrammes(),
        ]);
        setAllUserTasks(res1);
        setUsers(res2);
        setProgrammes(res3);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const findUserById = useCallback(
    (userId) => {
      const user = users.find((user) => user.id === userId);
      return user ? user.name : "Unknown User";
    },
    [users]
  );

  const findProgramById = useCallback(
    (programmeId) => {
      const programme = programmes.find(
        (programme) => programme.id === programmeId
      );
      return programme ? programme.name : "Unknown Programme";
    },
    [programmes]
  );

  const handleViewTask = useCallback(
    (taskId) => {
      navigate(`/tasks/${taskId}`);
    },
    [navigate]
  );

  const handleUpdateTask = useCallback(
    async (taskId) => {
      try {
        const taskDetails = await getTasksByTaskId(taskId);
        setCurrentTask(taskDetails);
        onOpen();
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    },
    [onOpen]
  );

  // passed to drawer for state mgmt
  const updateTaskInTable = (updatedTask) => {
    setAllUserTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const handleDeleteTask = useCallback(
    async (taskId) => {
      const previousTasks = [...allUserTasks];
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error("Error deleting task:", error);
        setAllUserTasks(previousTasks);
      } finally {
        setAllUserTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== taskId)
        );
      }
    },
    [allUserTasks]
  );

  const renderCell = useCallback(
    (task, columnKey) => {
      const cellValue = task[columnKey] ? task[columnKey] : "--";

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
          );
        case "programme_id":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {findProgramById(cellValue)}
              </p>
            </div>
          );
        case "assigner_id":
        case "assignee_id":
          return (
            <p className="text-bold text-sm capitalize">
              {findUserById(cellValue)}
            </p>
          );
        case "task_type":
          return <p className="text-bold text-sm capitalize">{cellValue}</p>;
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColors[task.status]}
              size="sm"
              variant="flat"
            >
              {task.status.replace(/_/g, " ")}
            </Chip>
          );
        case "deadline":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip content="View Task">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => handleViewTask(task.id)}
                >
                  <EyeIcon />
                </span>
              </Tooltip>
              <Tooltip content="Update Task">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => handleUpdateTask(task.id)}
                >
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete Task">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return <p className="text-sm">{cellValue}</p>;
      }
    },
    [
      findProgramById,
      findUserById,
      handleDeleteTask,
      handleUpdateTask,
      handleViewTask,
    ]
  );

  return (
    <>
      <Table aria-label="Task Table" isHeaderSticky removeWrapper>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={allUserTasks}
          isLoading={loading}
          loadingContent={<Spinner color="primary" />}
          emptyContent="No tasks to show"
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CreateTaskDrawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        taskDetails={currentTask}
        updateTaskInTable={updateTaskInTable}
      />
    </>
  );
};
