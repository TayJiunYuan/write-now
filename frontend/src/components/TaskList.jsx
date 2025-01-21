import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

import { updateTask } from "../services/api";

export const TaskList = ({ tasks, fetchTask }) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const navigate = useNavigate();

  const statusColors = {
    NOT_STARTED: "danger",
    IN_PROGRESS: "warning",
    COMPLETED: "success",
  };

  const handleEditClick = (taskId) => {
    setEditingTaskId((prevTaskId) => (prevTaskId === taskId ? null : taskId));
  };

  const handleStatusSelect = (task, status) => {
    const updatedTask = { ...task, status };
    setEditingTaskId(null);
    updateTask(updatedTask);
    fetchTask();
    navigate(0);
  };

  return (
    <Card className="bg-white shadow-md rounded-xl p-4 md:col-span-2">
      <CardHeader className="text-lg font-bold mb-2">Tasklist</CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-3 gap-10">
          {Object.entries(groupTasksByStatus(tasks)).map(
            ([status, tasks], index) => (
              <div key={index}>
                <Chip color={statusColors[status]}>{status}</Chip>
                {tasks.map((task, taskIndex) => (
                  <div className="flex-col py-2 flex relative" key={taskIndex}>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          className="w-96 bg-gray-300 border-2 border-black"
                        >
                          {task.name}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Edit Status">
                        <DropdownItem
                          key="edit"
                          onPress={() => handleEditClick(task.id)}
                        >
                          Edit Status
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>

                    {editingTaskId === task.id && (
                      <div className="absolute top-0 right-0 z-10">
                        <select
                          className="p-1 border border-black bg-white"
                          onChange={(e) =>
                            handleStatusSelect(task, e.target.value)
                          } // Call handleStatusSelect on selection
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select Status
                          </option>
                          <option value="NOT_STARTED">Not Started</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </CardBody>
    </Card>
  );
};

function groupTasksByStatus(tasks) {
  const statusOrder = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"];

  const grouped = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {});

  const orderedGroupedTasks = {};
  statusOrder.forEach((status) => {
    if (grouped[status]) {
      orderedGroupedTasks[status] = grouped[status];
    }
  });

  return orderedGroupedTasks;
}
