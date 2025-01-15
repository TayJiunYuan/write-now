import React from "react";
import { Card, CardHeader, Divider, CardBody, Checkbox, Avatar } from "@nextui-org/react";

const Programme = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">Event Details</CardHeader>
          
          <CardBody>
            <Divider />
            <h2 className="font-semibold pt-2 pb-2">Process, Publication, & Perspective: A conversation between Jemimah Wei and Wen-yi Lee</h2>
            <Divider/>
            <p className="pt-4">Join authors Jemimah Wei (The Original Daughter, Doubleday Books) and Wen-yi Lee (The Dark We Know, Zando; When They Burned the Butterfly, Tor) in a fireside chat about their writing process and publication trajectories, writing deeply Singaporean novels for international audiences, and navigating differences in genre and expectations along the way.</p>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">Meetings</CardHeader>
          <Divider />
          <CardBody>
            <p> Fri 1 Jan - <button className="text-blue-500 underline">View Details</button> </p>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">People</CardHeader>
          <Divider/>
          <div className="grid grid-cols-2">
            <CardBody className="font-semibold "> Authors
              <div className="flex gap-3 items-center pt-2">
                <Avatar name="Wei" />
                <Avatar name="Lee" />
              </div>
            </CardBody>
            <CardBody className="font-semibold"> Event Organizers
              <div className="flex gap-3 items-center pt-2">
                <Avatar name="Marc" />
                <Avatar name="Lee" />
              </div>
            </CardBody>
            <CardBody className="font-semibold"> Suppliers
              <div className="flex gap-3 items-center pt-2">
                <Avatar name="John" />
                <Avatar name="Penny" />
              </div>
            </CardBody>
          </div>
        </Card>

        <Card className="bg-white shadow-md rounded p-4">
          <CardHeader className="text-lg font-bold mb-2">Important Files</CardHeader>
          <Divider/>
          <CardBody>
            <div className="flex flex-col">
              <button className="text-blue-500 underline text-left">Budget.docx</button>
              <button className="text-blue-500 underline text-left">Floor Plan</button>
              <button className="text-blue-500 underline text-left">Deliverables.docx</button>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-md rounded p-4 md:col-span-2">
          <CardHeader className="text-lg font-bold mb-2">Tasklist</CardHeader>
          <Divider />
          <CardBody>
            <Checkbox defaultSelected lineThrough>Buy 8 tables</Checkbox>
            <Checkbox defaultSelected lineThrough>Buy 16 chairs</Checkbox>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Programme;