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
} from "@heroui/react";
import {
  getTasksByUserId,
  getUsersWithoutCredentials,
  getAllProgrammes,
  deleteTask,
  updateTask,
  createNewTask,
} from "../services/api";
import { columns, statusColors } from "../constants/TableElements";
import { EyeIcon, EditIcon, DeleteIcon } from "../constants/Icons";
import CreateTaskDrawer from "./CreateTaskDrawer";
import { Toast } from "./Toast";

export const TaskTable = ({ isCreateTaskOpen, onCreateTaskOpenChange }) => {
  const [allUserTasks, setAllUserTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("create");

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

  const handleOpenUpdateTask = useCallback(
    (taskId) => {
      const taskDetails = allUserTasks.find((task) => task.id === taskId);

      if (taskDetails) {
        setDrawerMode("update");
        setCurrentTask(taskDetails);
        setIsDrawerOpen(true);
      }
    },
    [allUserTasks]
  );

  const handleCreateTask = async (taskData) => {
    try {
      const createdTask = await createNewTask(taskData);
      setAllUserTasks((prevTasks) => [...prevTasks, createdTask]);
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await updateTask(taskData);
      setAllUserTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  const handleDeleteTask = useCallback(async (taskId) => {
    try {
      const res = await deleteTask(taskId);
      if (res) {
        setAllUserTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== taskId)
        );
      }
      setToastMessage("Task deleted successfully! 🎉");
    } catch (error) {
      console.error("Error deleting task:", error);
      setToastMessage("Failed to delete task. Please try again.");
    }
  }, []);

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
                  onClick={() => navigate(`/tasks/${task.id}`)}
                >
                  <EyeIcon />
                </span>
              </Tooltip>
              <Tooltip content="Update Task">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => handleOpenUpdateTask(task.id)}
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
      handleOpenUpdateTask,
      navigate,
    ]
  );

  return (
    <>
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
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
          emptyContent="Great! You have completed all your tasks."
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
        isOpen={drawerMode === "update" ? isDrawerOpen : isCreateTaskOpen}
        onOpenChange={
          drawerMode === "update" ? setIsDrawerOpen : onCreateTaskOpenChange
        }
        taskDetails={drawerMode === "update" ? currentTask : null}
        setDrawerMode={setDrawerMode}
        handleCreateTask={handleCreateTask}
        handleUpdateTask={handleUpdateTask}
      />
    </>
  );
};
