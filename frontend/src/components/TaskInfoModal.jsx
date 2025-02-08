import React, { useRef } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ModalContent,
  useDraggable,
  Chip,
} from "@heroui/react";
import { statusColors } from "../constants/TableElements";

const TaskInfoModal = ({
  isOpen,
  onOpenChange,
  task,
  findProgramById,
  findUserById,
}) => {
  // draggable modal
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

  return (
    <Modal ref={targetRef} isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader {...moveProps}>{task?.name}</ModalHeader>
            <ModalBody className="space-y-4 p-4">
              <p className="text-gray-500">{task?.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Assignee:</p>
                  {findUserById(task?.assignee_id)}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Assigner:</p>
                  {findUserById(task?.assigner_id)}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Programme:</p>
                  {findProgramById(task?.programme_id)}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Task Type:</p>
                  {task?.task_type}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Deadline:</p>
                  {task?.deadline}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Status:</p>
                  <Chip
                    className="capitalize"
                    color={statusColors[task.status]}
                    size="sm"
                    variant="flat"
                  >
                    {task.status.replace(/_/g, " ")}
                  </Chip>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose} color="danger" variant="flat">
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TaskInfoModal;
