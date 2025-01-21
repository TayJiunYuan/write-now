import React, { useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  DatePicker,
  Textarea,
  Input,
  Select,
  SelectItem,
  Form,
  useDraggable,
} from "@heroui/react";
import { now, getLocalTimeZone } from "@internationalized/date";
import { createNewMeeting } from "../services/api";

export const CreateMeetingModal = ({
  isOpen,
  onOpenChange,
  id,
  attendees,
  users,
}) => {
  const [startTime, setStartTime] = useState(now(getLocalTimeZone()));
  const [durationHours, setDurationHours] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const allAttendeeIds = Object.values(attendees).flat();

  // draggable modal
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

  const filteredUsers = users.filter((user) =>
    allAttendeeIds.includes(user.id)
  );

  const handleClearForm = () => {
    setStartTime(new Date());
    setDurationHours("");
    setSummary("");
    setDescription("");
    setSelectedUsers("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { year, month, day, hour, minute, second, millisecond, offset } =
      startTime;
    const date = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second, millisecond)
    );
    const adjustedDate = new Date(date.getTime() - offset);
    const isoDate = adjustedDate.toISOString();
    const userId = localStorage.getItem("userId");
    const array = Array.from(selectedUsers);

    const meetingData = {
      programme_id: id,
      organizer_id: userId,
      attendee_ids: array,
      start_time: isoDate,
      duration_hours: durationHours,
      summary: summary,
      description: description,
    };

    try {
      await createNewMeeting(meetingData);
    } catch (error) {
      console.error("Error creating new programme:", error);
    } finally {
      handleClearForm();
      onOpenChange(false);
    }
  };

  return (
    <Modal
      ref={targetRef}
      isOpen={isOpen}
      size="md"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader {...moveProps}>Create Meeting</ModalHeader>
            <ModalBody>
              <Form
                id="create-task-form"
                validationBehavior="native"
                onSubmit={handleSubmit}
              >
                <Input
                  isRequired
                  label="Meeting Title"
                  labelPlacement="outside"
                  placeholder="Enter summary of meeting"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
                <Textarea
                  isRequired
                  label="Meeting Description"
                  labelPlacement="outside"
                  placeholder="Enter meeting description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <DatePicker
                  isRequired
                  hideTimeZone
                  showMonthAndYearPickers
                  showTimeSelect
                  defaultValue={now(getLocalTimeZone())}
                  label="Start Date & Time"
                  labelPlacement="outside"
                  selected={startTime}
                  onChange={(dateTime) => setStartTime(dateTime)}
                />
                <Input
                  isRequired
                  label="Duration (in Hours)"
                  labelPlacement="outside"
                  type="number"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  placeholder="Enter duration in hours"
                />
                <Select
                  isRequired
                  label="Attendee(s)"
                  labelPlacement="outside"
                  placeholder="Select attendee(s)"
                  selectionMode="multiple"
                  selectedKeys={selectedUsers}
                  onSelectionChange={setSelectedUsers}
                >
                  {filteredUsers.map((user) => (
                    <SelectItem key={user.id}>{user.name}</SelectItem>
                  ))}
                </Select>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                onPress={() => {
                  onClose();
                  handleClearForm();
                }}
              >
                Close
              </Button>
              <Button color="primary" type="submit" form="create-task-form">
                Create Meeting
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
