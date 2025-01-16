import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { getUsers } from "../services/api";

export const CreateGroupModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);

  const handleSubmit = () => {
    const groupData = {
      name: name,
    };

    onClose();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isOpen]);

  useEffect(() => {
    console.log(users);
  }, [users]);

  return (
    <Modal isOpen={isOpen} size={"md"} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create Group
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="name">Name</label>
                  <Textarea
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter group name"
                    rows={4}
                  />
                </div>
                <div>
                  <label htmlFor="attendees">Attendees</label>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button auto flat color="error" onPress={onClose}>
                Close
              </Button>
              <Button auto onPress={handleSubmit}>
                Create Group
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
