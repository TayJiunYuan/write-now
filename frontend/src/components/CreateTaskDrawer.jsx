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
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { createNewTask, getUsers, getAllProgrammes } from "../services/api";
import { Toast } from "./Toast";

const CreateTaskDrawer = ({
  isOpen,
  onOpenChange,
  assignees = [],
  programmes = [],
}) => {
  const [isForOthers, setIsForOthers] = useState(false);

  const [assigneeId, setAssigneeId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [programmeId, setProgrammeId] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");

  // to be used for selection mapping
  const [availableAssignees, setAvailableAssignees] = useState(assignees || []);
  const [availableProgrammes, setAvailableProgrammes] = useState(
    programmes || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (assignees.length === 0) {
          const users = await getUsers();
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
  }, []);

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
      assignee_id: isForOthers ? assigneeId : assignerId,
      assigner_id: assignerId,
      name: taskName,
      description: taskDescription,
      deadline: taskDeadline,
      status: "NOT_STARTED",
      programme_id: programmeId,
    };

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
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1">
            Create a new task
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
                    setIsForOthers(e.target.value === "others" ? true : false)
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
                    value={assigneeId}
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
                  value={programmeId}
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
              Create Task
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CreateTaskDrawer;
