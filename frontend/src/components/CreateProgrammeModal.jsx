import React, { useState, useRef } from "react";
import {
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  DatePicker,
  Input,
  Textarea,
  Select,
  SelectItem,
  Divider,
  Form,
  useDraggable,
} from "@heroui/react";
import { now, getLocalTimeZone } from "@internationalized/date";

import { createNewProgramme } from "../services/api";
import { programmeTypes } from "../constants/ProgrammesElements";
import { CreateGroupModal } from "./CreateGroupModal";

export const CreateProgrammeModal = ({ isOpen, onOpenChange, fetchData }) => {
  const [startTime, setStartTime] = useState(now(getLocalTimeZone()));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedProgType, setSelectedProgType] = useState("");

  // draggable modal
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

  // create group modal
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groups, setGroups] = useState([]);

  const handleProgTypeChange = (e) => {
    if (!e.target.value) {
      // if user clicks on the same option
      return;
    } else {
      setSelectedProgType(e.target.value);
    }
  };

  const handleClearForm = () => {
    setStartTime(new Date());
    setName("");
    setDescription("");
    setLocation("");
    setSelectedProgType("");
    setGroups([]);
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

    let combinedData = {};
    groups.forEach((group) => {
      const { name, attendees } = group;
      if (!combinedData[name]) {
        combinedData[name] = [];
      }
      combinedData[name] = combinedData[name].concat(attendees); // Add attendees
    });

    const programmeData = {
      name: name,
      description: description,
      type: selectedProgType,
      groups: combinedData,
      datetime: isoDate,
      location: location,
    };

    try {
      await createNewProgramme(programmeData);
    } catch (error) {
      console.error("Error creating new programme:", error);
    } finally {
      handleClearForm();
      onOpenChange(false);
      fetchData();
    }
  };

  // for group modal
  const handleGroupModal = () => setShowGroupModal(true);
  const handleGroupModalClose = () => setShowGroupModal(false);

  const handleGroupDataSubmit = (data) => {
    const { attendees, name } = data;
    const newGroup = { name, attendees };
    setGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  return (
    <>
      <Modal
        ref={targetRef}
        isOpen={isOpen}
        size="md"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader {...moveProps}>Create Programme</ModalHeader>
              <ModalBody>
                <Form
                  id="create-task-form"
                  validationBehavior="native"
                  onSubmit={handleSubmit}
                >
                  <Input
                    isRequired
                    label="Programme Name"
                    labelPlacement="outside"
                    placeholder="Enter programme name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Textarea
                    isRequired
                    label="Programme Description"
                    labelPlacement="outside"
                    placeholder="Enter programme description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <Textarea
                    isRequired
                    label="Location"
                    labelPlacement="outside"
                    placeholder="Enter the location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <Select
                    isRequired
                    label="Programme Type"
                    labelPlacement="outside"
                    placeholder="Select a programme type"
                    selectedKeys={[selectedProgType]}
                    onChange={handleProgTypeChange}
                  >
                    {programmeTypes
                      .filter((type) => type !== "All Programmes")
                      .map((type) => (
                        <SelectItem key={type}>{type}</SelectItem>
                      ))}
                  </Select>
                  <DatePicker
                    isRequired
                    hideTimeZone
                    showMonthAndYearPickers
                    showTimeSelect
                    defaultValue={now(getLocalTimeZone())}
                    label="Event Date & Time"
                    labelPlacement="outside"
                    selected={startTime}
                    onChange={(dateTime) => setStartTime(dateTime)}
                  />
                  <Divider className="my-2" />
                  <div className="flex flex-col gap-4">
                    <label htmlFor="group">Groups</label>
                    {groups.length > 0 && (
                      <div className="flex flex-wrap gap-4">
                        {groups.map((group, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            <Avatar name={group.name} size="md" />
                            <span className="text-sm text-center mt-2">
                              {group.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button onPress={handleGroupModal}>Add New Group</Button>
                  </div>
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
                  Create Programme
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <CreateGroupModal
        isOpen={showGroupModal}
        onClose={handleGroupModalClose}
        onSubmit={handleGroupDataSubmit}
      />
    </>
  );
};
