import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Divider,
  CardBody,
  Checkbox,
  Avatar,
  Button,
} from "@heroui/react";
import { useLocation } from "react-router-dom";
import { CreateMeetingModal } from "../components/CreateMeetingModal";
import { getMeetings } from "../services/api";
import { MeetingList } from "../components/MeetingList";

const Programme = () => {
  const location = useLocation();
  const { event } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);

  const programmeID = event.id;
  const title = event.name;
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getMeetings(programmeID);
      setMeetings(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("title is:", title);
  }, [title]);

  return (
    <div className="container mx-auto min-h-screen pt-[65px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">
            Programme Details
          </CardHeader>
          <CardBody>
            <Divider />
            <h2 className="font-semibold pt-2 pb-2">{event.name}</h2>
            <Divider />
            <p className="pt-4">{event.description}</p>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">
            <div className="flex justify-between items-center w-full">
              <p>Meetings</p>
              <Button
                className="text-right text-base px-4 py-1 border bg-white border-red-500 text-black hover:bg-red-500 hover:text-white transition max-w-56"
                onPress={handleOpen}
              >
                Create Meetings
              </Button>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <MeetingList meetings={meetings} title={title} />
          </CardBody>
        </Card>

        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">People</CardHeader>
          <Divider />
          <div>
            {Object.entries(event.groups).map(([group, names]) => (
              <div className="grid grid-cols-2" key={group}>
                <CardBody className="font-semibold">
                  {group}
                  <div className="flex gap-3 items-center pt-2">
                    {names.map((name) => (
                      <Avatar key={name} name={name} />
                    ))}
                  </div>
                </CardBody>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">
            Important Files
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col">
              <button className="text-blue-500 underline text-left">
                Budget.docx
              </button>
              <button className="text-blue-500 underline text-left">
                Floor Plan
              </button>
              <button className="text-blue-500 underline text-left">
                Deliverables.docx
              </button>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-md rounded p-4 md:col-span-2">
          <CardHeader className="text-lg font-bold mb-2">Tasklist</CardHeader>
          <Divider />
          <CardBody>
            <Checkbox defaultSelected lineThrough>
              Buy 8 tables
            </Checkbox>
            <Checkbox defaultSelected lineThrough>
              Buy 16 chairs
            </Checkbox>
          </CardBody>
        </Card>
      </div>
      <CreateMeetingModal
        isOpen={isOpen}
        onClose={handleClose}
        id={programmeID}
      />
    </div>
  );
};

export default Programme;
