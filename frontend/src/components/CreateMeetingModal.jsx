import React, { useState } from "react";
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
} from "@nextui-org/react";
import { now, getLocalTimeZone } from "@internationalized/date";
import { createMeetings } from "../services/api";

export const CreateMeetingModal = ({ isOpen, onClose, programmeId }) => {
  const [startTime, setStartTime] = useState(new Date());
  const [durationHours, setDurationHours] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    const { year, month, day, hour, minute, second, millisecond, offset } =
      startTime;
    const date = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second, millisecond)
    );
    const adjustedDate = new Date(date.getTime() - offset);
    const isoDate = adjustedDate.toISOString();
    console.log(isoDate);

    const summaryString = summary + " - " + isoDate;

    const meetingData = {
      programme_id: "67887f462f43d9720fbe448a",
      organizer_id: "108892597123264895192",
      attendee_ids: ["108892597123264895192", "118276801488272131566"],
      start_time: isoDate,
      duration_hours: durationHours,
      summary: summary,
      description: description,
    };
    console.log(meetingData);
    createMeetings(meetingData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} size={"md"} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create Meeting
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="startTime">Start Time</label>
                  <DatePicker
                    hideTimeZone
                    showMonthAndYearPickers
                    defaultValue={now(getLocalTimeZone())}
                    aria-label="Event Date"
                    selected={startTime}
                    onChange={(date) => setStartTime(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    className="nextui-input"
                  />
                </div>
                <div>
                  <label htmlFor="durationHours">Duration (hours)</label>
                  <Input
                    id="durationHours"
                    type="number"
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    placeholder="Enter duration in hours"
                  />
                </div>
                <div>
                  <label htmlFor="summary">Title</label>
                  <Textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Enter meeting summary"
                    rows={4}
                  />
                </div>
                <div>
                  <label htmlFor="description">Description</label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter meeting description"
                    rows={4}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button auto flat color="error" onPress={onClose}>
                Close
              </Button>
              <Button auto onPress={handleSubmit}>
                Create Meeting
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
