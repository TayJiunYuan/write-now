import React, { useState, useEffect } from "react";
import { Textarea, useDisclosure, Button } from "@nextui-org/react";

import CreateTaskDrawer from "./CreateTaskDrawer";

export const EmailSummary = () => {
  const [isSummaryPresent, setIsSummaryPresent] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchSummarisedEmails = () => {
      console.log("fetching summarised emails");
    };

    fetchSummarisedEmails();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      {isSummaryPresent ? (
        <div className="flex w-full gap-3 items-center">
          <Textarea
            isReadOnly
            className="w-full"
            defaultValue="Jane and Mary requested the year end budget review from you; deadline 25 Jan 2025."
            label="Email thread with Jane and Mary"
            labelPlacement="outside"
            placeholder="Enter your description"
            variant="bordered"
          />
          <Button color="primary" variant="flat" onPress={onOpen}>
            Create Task
          </Button>
          {/* <Textarea
            isReadOnly
            className="w-full"
            defaultValue="CEO Vincent complimented your work ethic and responsibility. Mentioned to keep up the good work."
            label="Email thread with Vincent"
            labelPlacement="outside"
            placeholder="Enter your description"
            variant="bordered"
          /> */}
        </div>
      ) : (
        <p className="text-sm/6 text-gray-600">No other summarised threads.</p>
      )}
      <CreateTaskDrawer isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};
