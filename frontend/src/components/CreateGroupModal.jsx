import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { getUsersWithoutCredentials } from "../services/api";

export const CreateGroupModal = ({ isOpen, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(new Set([]));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getUsersWithoutCredentials();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const groupData = {
      name: name.trim(),
      attendees: Array.from(selectedUsers),
    };

    onSubmit(groupData);
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setSelectedUsers(new Set([]));
    onClose();
  };

  return (
    <>
      {loading ? (
        <Spinner className="flex justify-center items-center" />
      ) : (
        <Modal isOpen={isOpen} size="md" onClose={handleClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Create Group</ModalHeader>
                <ModalBody>
                  <Input
                    isRequired
                    label="Name"
                    labelPlacement="outside"
                    placeholder="Enter a group name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    {users.map((user) => (
                      <SelectItem key={user.id}>{user.name}</SelectItem>
                    ))}
                  </Select>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={handleClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={handleSubmit}>
                    Create Group
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
