import React, { useEffect, useState } from "react";
import {
  Avatar,
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
  const [groupData, setGroupData] = useState([]);
  const [groupName, setGroupName] = useState([]);

  const handleSubmit = () => {
    const { year, month, day, hour, minute, second, millisecond, offset } =
      startTime;
    const date = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second, millisecond)
    );
    const adjustedDate = new Date(date.getTime() - offset);
    const isoDate = adjustedDate.toISOString();

    let combinedData = {};

    groupData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (!combinedData[key]) {
          combinedData[key] = [];
        }
        combinedData[key] = combinedData[key].concat(item[key]);
      });
    });

    const programmeData = {
      name: name,
      description: description,
      type: selectedCategory,
      groups: combinedData,
      datetime: isoDate,
      location: location,
    };

    console.log(programmeData);

    createNewProgramme(programmeData);
    onClose();
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleGroupDataSubmit = (data) => {
    const attendees = data.attendees;
    const name = data.name;

    const result = {
      [name]: attendees,
    };

    console.log(data.name);
    setGroupName((prevGroupNames) => [...prevGroupNames, name]);
    if (groupData.length === 0) {
      setGroupData(result);
    } else {
      setGroupData([groupData, result]);
    }
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
                    <Textarea
                      isRequired
                      value={name}
                      label="Name"
                      labelPlacement="outside"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter programme name"
                    />
                  </div>
                  <div>
                    <Textarea
                      isRequired
                      label="Description"
                      labelPlacement="outside"
                      placeholder="Enter your description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <Textarea
                      isRequired
                      value={location}
                      label="Location"
                      labelPlacement="outside"
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter the location"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Select
                      isRequired
                      label="Category"
                      labelPlacement="outside"
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
                    {groupName.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-4">
                        {groupName.map((name, index) => (
                          <div key={index}>
                            <Avatar name={name} size="md" />
                          </div>
                        ))}
                      </div>
                    )}
                    <Button className=" max-w-28 mt-5" onPress={handleShow}>
                      Add new group
                    </Button>
                  </div>
                  <div>
                    <DatePicker
                      isRequired
                      hideTimeZone
                      showMonthAndYearPickers
                      defaultValue={now(getLocalTimeZone())}
                      label="Event Date"
                      labelPlacement="outside"
                      selected={startTime}
                      onChange={(date) => setStartTime(date)}
                      showTimeSelect
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
