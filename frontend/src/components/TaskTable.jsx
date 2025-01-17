import React, { useCallback, useState, useEffect } from "react";
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
  getTasksByAssigner,
  getTasksByAssignee,
  getUsersWithoutCredentials,
  getAllProgrammes,
} from "../services/api";
import { columns, statusColors } from "../constants/TableElements";
import { EyeIcon, DeleteIcon, EditIcon } from "../constants/Icons";

export const TaskTable = () => {
  const [tasksByAssigner, setTasksByAssigner] = useState([]);
  const [tasksByAssignee, setTasksByAssignee] = useState([]);
  const [users, setUsers] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [tasksAssigner, tasksAssignee, allUsers, allProgrammes] =
          await Promise.all([
            getTasksByAssigner(userId),
            getTasksByAssignee(userId),
            getUsersWithoutCredentials(),
            getAllProgrammes(),
          ]);
        setTasksByAssigner(tasksAssigner);
        setTasksByAssignee(tasksAssignee);
        setUsers(allUsers);
        setProgrammes(allProgrammes);
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

  const handleUpdateTask = (taskId) => {
    // Logic for updating the task (e.g., opening a modal or calling an API)
    console.log("Update task:", taskId);
  };

  const handleDeleteTask = (taskId) => {
    // Logic for deleting the task (e.g., confirmation dialog and API call)
    console.log("Delete task:", taskId);
  };

  const renderCell = useCallback((task, columnKey) => {
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
        return (
          <p className="text-bold text-sm capitalize">
            {findUserById(cellValue)}
          </p>
        );
      case "assignee_id":
        return (
          <p className="text-bold text-sm capitalize">
            {findUserById(cellValue)}
          </p>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColors[task.status]}
            size="sm"
            variant="flat"
          >
            {task.status.replace(/_/g, ' ')}
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
          <div className="relative flex items-center gap-2">
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
        return cellValue ? (
          <p className="text-sm">{cellValue}</p>
        ) : (
          <p className="text-sm text-gray-400">No data</p>
        );
    }
  }, []);

  return (
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
        items={tasksByAssigner}
        isLoading={loading}
        loadingContent={<Spinner color="primary" />}
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
  );
};
