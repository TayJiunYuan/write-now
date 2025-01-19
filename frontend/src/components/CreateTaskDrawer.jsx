import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Input,
  Form,
  Select,
  SelectItem,
  Textarea,
  Spinner,
} from "@heroui/react";
import {
  createNewTask,
  updateTask,
  getUsersWithoutCredentials,
  getAllProgrammes,
} from "../services/api";
import { Toast } from "./Toast";
import { taskTypes } from "../constants/TableElements";

const CreateTaskDrawer = ({
  isOpen,
  onOpenChange,
  assignees = [],
  programmes = [],
  withAIData,
  taskDetails,
  updateTaskInTable,
}) => {
  const [isForOthers, setIsForOthers] = useState(false);
  const [assigneeId, setAssigneeId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [programmeId, setProgrammeId] = useState("");
  const [taskType, setTaskType] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");

  const [availableAssignees, setAvailableAssignees] = useState(assignees || []);
  const [availableProgrammes, setAvailableProgrammes] = useState(
    programmes || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // populate task form if preset data is present
  useEffect(() => {
    if (withAIData) {
      setTaskName(withAIData.name || "");
      setTaskDescription(withAIData.description || "");
    }
    if (taskDetails) {
      console.log(taskDetails)
      console.log("assigned_to_self:", taskDetails.assigned_to_self);
      setIsForOthers(!taskDetails.assigned_to_self);
      setAssigneeId(taskDetails.assignee_id || "");
      setTaskName(taskDetails.name || "");
      setTaskDescription(taskDetails.description || "");
      setProgrammeId(taskDetails.programme_id || "");
      setTaskType(taskDetails.task_type || "");
      setTaskDeadline(taskDetails.deadline || "");
    }
  }, [withAIData, taskDetails]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (assignees.length === 0) {
          const users = await getUsersWithoutCredentials();
          setAvailableAssignees(users);
        }
        if (programmes.length === 0) {
          const programmesData = await getAllProgrammes();
          setAvailableProgrammes(programmesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [assignees.length, programmes.length]);

  const handleClearForm = () => {
    setIsForOthers(false);
    setAssigneeId("");
    setTaskName("");
    setTaskDescription("");
    setProgrammeId("");
    setTaskDeadline("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const assignerId = String(localStorage.getItem("userId"));
    const taskData = {
      assigned_to_self: !isForOthers,
      assignee_id: isForOthers ? assigneeId : assignerId,
      assigner_id: assignerId,
      name: taskName,
      description: taskDescription,
      deadline: taskDeadline,
      status: "NOT_STARTED",
      programme_id: programmeId,
      task_type: taskType,
    };

    if (taskDetails) {
      updateTask(taskData)
        .then((updatedTask) => {
          setToastMessage("Task updated successfully! 🎉");
          updateTaskInTable(updatedTask);
          onOpenChange(false);
        })
        .catch((err) => {
          console.error("Error creating task:", err);
        })
        .finally(() => {
          handleClearForm();
        });
    } else {
      createNewTask(taskData)
        .then(() => {
          setToastMessage("Task created successfully! 🎉");
          onOpenChange(false);
        })
        .catch((err) => {
          console.error("Error creating task:", err);
        })
        .finally(() => {
          handleClearForm();
        });
    }
  };

  const handleDrawerClose = () => {
    handleClearForm();
    onOpenChange(false);
  };

  return (
    <>
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={handleDrawerClose}
      >
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1">
            {taskDetails ? "Update current task" : "Create a new task"}
          </DrawerHeader>
          <DrawerBody>
            {isLoading ? (
              <Spinner />
            ) : (
              <Form
                id="create-task-form"
                className="w-full max-w-sm gap-6"
                validationBehavior="native"
                onSubmit={handleFormSubmit}
              >
                <Select
                  isRequired
                  label="Create task for"
                  placeholder="Select an option"
                  variant="bordered"
                  onChange={(e) =>
                    setIsForOthers(e.target.value === "others")
                  }
                >
                  <SelectItem key="self">Self</SelectItem>
                  <SelectItem key="others">Others</SelectItem>
                </Select>
                {isForOthers && (
                  <Select
                    isRequired
                    label="Assignee"
                    placeholder="Select an assignee"
                    variant="bordered"
                    onChange={(e) => setAssigneeId(e.target.value)}
                  >
                    {availableAssignees.length > 0 ? (
                      availableAssignees.map((assignee) => (
                        <SelectItem key={assignee.id} value={assignee.id}>
                          {assignee.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key="no-options" disabled>
                        No assignees available
                      </SelectItem>
                    )}
                  </Select>
                )}
                <Input
                  isRequired
                  label="Task Name"
                  placeholder="Enter task name"
                  variant="bordered"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
                <Textarea
                  isRequired
                  label="Task Description"
                  placeholder="Enter task description"
                  variant="bordered"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
                <Select
                  isRequired
                  label="Programme"
                  placeholder="Select programme"
                  variant="underlined"
                  onChange={(e) => setProgrammeId(e.target.value)}
                >
                  {availableProgrammes.length > 0 ? (
                    availableProgrammes.map((programme) => (
                      <SelectItem key={programme.id} value={programme.id}>
                        {programme.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem key="no-options" disabled>
                      No programmes available
                    </SelectItem>
                  )}
                </Select>
                <Select
                  isRequired
                  label="Task Type"
                  placeholder="Select task type"
                  variant="underlined"
                  onChange={(e) => setTaskType(e.target.value)}
                >
                  {taskTypes.map((taskType) => (
                    <SelectItem key={taskType} value={taskType}>
                      {taskType}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  isRequired
                  label="Deadline"
                  placeholder="Enter task deadline"
                  type="date"
                  variant="bordered"
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                />
              </Form>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button color="danger" variant="flat" onPress={handleDrawerClose}>
              Close
            </Button>
            <Button color="primary" type="submit" form="create-task-form">
              {taskDetails ? "Update Task" : "Create Task"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CreateTaskDrawer;
