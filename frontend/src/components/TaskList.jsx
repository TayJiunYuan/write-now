import React from "react";
import {
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from "@heroui/react";

import { statusColors } from "../constants/TableElements";
import { taskStatuses } from "../constants/TableElements";

export const TaskList = ({ tasks, handleStatusSelect }) => {
  const statusOrder = taskStatuses

  const groupTasksByStatus = (tasks) => {
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
  };

  return (
    <div className="grid grid-cols-3 gap-10">
      {statusOrder.map((status) => {
        const tasksForStatus = groupTasksByStatus(tasks)[status] || [];

        return (
          <div key={status}>
            <Chip color={statusColors[status]} className="mb-4">
              {status.replace(/_/g, " ")}
            </Chip>

            <div className="flex flex-col gap-2 justify-center items-center">
              {tasksForStatus.length > 0 ? (
                tasksForStatus.map((task) => (
                  <Popover key={task.id}>
                    <PopoverTrigger>
                      <Button
                        color={statusColors[task.status]}
                        variant="flat"
                        className="w-full"
                      >
                        {task.name}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="p-2 space-y-2">
                        <p className="text-sm font-medium">Change Status</p>
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() =>
                            handleStatusSelect(task, "NOT_STARTED")
                          }
                        >
                          Not Started
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          color="warning"
                          onPress={() =>
                            handleStatusSelect(task, "IN_PROGRESS")
                          }
                        >
                          In Progress
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          color="success"
                          onPress={() => handleStatusSelect(task, "COMPLETED")}
                        >
                          Completed
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No tasks here</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
