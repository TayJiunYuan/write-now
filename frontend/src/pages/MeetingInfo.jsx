import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Tooltip,
  Badge,
  Avatar,
  Link,
  useDisclosure,
} from "@heroui/react";
import { getTaskDetailsWithAI } from "../services/api";
import CreateTaskDrawer from "../components/CreateTaskDrawer";

const MeetingInfo = () => {
  const location = useLocation();
  const { meeting, title } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    console.log(meeting);
  }, [meeting]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [withAIData, setWithAIData] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const summaryTitle = meeting.summary.split("-")[0];

  const onOpenChangeWithAI = async (summary) => {
    try {
      setIsLoadingAI(true);
      const data = await getTaskDetailsWithAI(summary);
      setWithAIData(data);
    } catch (error) {
      console.error("Error fetching AI data:", error);
      setWithAIData(null);
    } finally {
      setIsLoadingAI(false);
    }

    onOpen();
  };

  return (
    <div className="container mx-auto min-h-screen pt-[65px]">
      <div className="my-4 space-y-4">
        <Button onPress={() => navigate(-1)} color="danger" variant="flat">
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white shadow-md rounded-xl p-4 col-span-2">
            <CardHeader className="text-lg font-bold">
              Meeting Information for [{title}]
            </CardHeader>
            <div className="px-3">
              <Divider />
            </div>
            <CardBody className="gap-1">
              <h2 className="font-medium">{summaryTitle}</h2>
              <Divider />
              <p className="font-light text-gray-500 py-2">
                {meeting.description}
              </p>
            </CardBody>
          </Card>

          <Card className="bg-white shadow-md rounded-xl p-4">
            <CardHeader className="text-lg font-bold">Participants</CardHeader>
            <div className="px-3">
              <Divider />
            </div>
            <CardBody className="flex flex-row gap-3">
              {meeting.attendees.map((email) => (
                <Tooltip key={email} content={email} showArrow={true}>
                  <Badge
                    color="primary"
                    content={"Org"}
                    isInvisible={meeting.organizer !== email}
                    shape="rectangle"
                    size="sm"
                  >
                    <Avatar key={email} name={email} />
                  </Badge>
                </Tooltip>
              ))}
            </CardBody>
          </Card>

          <Card className="bg-white shadow-md rounded-xl p-4">
            <CardHeader className="text-lg font-bold">Meeting Link</CardHeader>
            <div className="px-3">
              <Divider />
            </div>
            <CardBody>
              <Link
                isExternal
                showAnchorIcon
                color="primary"
                underline="always"
                href={meeting.meet_link}
              >
                Click Here To Join The Meeting
              </Link>
            </CardBody>
          </Card>

          <Card className="bg-white shadow-md rounded-xl p-4">
            <CardHeader className="text-lg font-bold justify-between">
              Meeting Minutes
              <Popover placement="bottom" showArrow={true}>
                <PopoverTrigger>
                  <Button color="primary" variant="light">View Transcript</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="text-small font-medium">Transcript</div>
                    <div className="text-gray-500 text-tiny py-2">
                      {meeting.transcript
                        ? meeting.transcript
                        : "No meeting transcript available"}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </CardHeader>
            <div className="px-3">
              <Divider />
            </div>
            <CardBody>
              <ul>
                {meeting.meeting_minutes &&
                meeting.meeting_minutes.length > 0 ? (
                  meeting.meeting_minutes.map((minute, index) => (
                    <li key={index}>• {minute}</li>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No meeting minutes available
                  </p>
                )}
              </ul>
            </CardBody>
          </Card>

          <Card className="bg-white shadow-md rounded-xl p-4">
            <CardHeader className="text-lg font-bold justify-between">
              Suggested Tasks from AI
              <Button color="primary" onPress={onOpen}>
                Create Task
              </Button>
            </CardHeader>
            <div className="px-3">
              <Divider />
            </div>
            <CardBody>
              <ul>
                {meeting.action_items && meeting.action_items.length > 0 ? (
                  meeting.action_items.map((action, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center mb-2 pr-2"
                    >
                      <span>• {action}</span>
                      <Button
                        isLoading={isLoadingAI}
                        color="secondary"
                        radius="full"
                        onPress={() => onOpenChangeWithAI(action)}
                      >
                        Create Task with AI
                      </Button>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No tasks available
                  </p>
                )}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
      <CreateTaskDrawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        withAIData={withAIData}
        definedProgrammeId={meeting.programme_id}
      />
    </div>
  );
};

export default MeetingInfo;
