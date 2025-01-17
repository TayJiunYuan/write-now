import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  DatePicker,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { now, getLocalTimeZone } from "@internationalized/date";
import { createNewProgramme } from "../services/api";
import { categoriess } from "../constants/ProgrammesElements";
import { CreateGroupModal } from "./CreateGroupModal";

export const CreateProgrammeModal = ({ isOpen, onClose }) => {
  const [startTime, setStartTime] = useState(new Date());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [groupData, setGroupData] = useState(null);

  const handleSubmit = () => {
    const { year, month, day, hour, minute, second, millisecond, offset } =
      startTime;
    const date = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second, millisecond)
    );
    const adjustedDate = new Date(date.getTime() - offset);
    const isoDate = adjustedDate.toISOString();

    const programmeData = {
      name: name,
      description: description,
      type: selectedCategory,
      groups: groupData,
      datetime: isoDate,
      location: location,
    };

    console.log(programmeData);

    createNewProgramme(programmeData);
    onClose();
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    console.log("Selected Category:", e.target.value);
  };

  const handleGroupDataSubmit = (data) => {
    setGroupData(data);
    console.log("Received group data:", data);

    const attendees = data.attendees;
    const result = {
      [data.name]: attendees,
    };

    setGroupData(result);
  };

  const handleShow = () => setShowForm(true);
  const handleClose = () => setShowForm(false);

  return (
    <>
      <Modal isOpen={isOpen} size={"md"} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Programme
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="name">Name</label>
                    <Textarea
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter programme name"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label htmlFor="description">Description</label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter programme description"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label htmlFor="location">Location</label>
                    <Textarea
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter programme description"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label htmlFor="category">Category</label>
                    <Select
                      placeholder="Select a category"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    >
                      {categoriess.map((category) => (
                        <SelectItem key={category.key}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="group">Group</label>
                    <Button className=" max-w-28" onPress={handleShow}>
                      Add new group
                    </Button>
                  </div>
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
                      className="heroui-input"
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
      <CreateGroupModal
        isOpen={showForm}
        onClose={handleClose}
        onSubmit={handleGroupDataSubmit}
      />
    </>
  );
};
