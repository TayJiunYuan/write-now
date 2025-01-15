import React, { useState } from "react";
import { Textarea } from "@nextui-org/react";

export const EmailSummary = () => {
  const [isSummaryPresent, setIsSummaryPresent] = useState(true);
  return (
    <div className="flex flex-col items-center gap-6">
      {isSummaryPresent ? (
        <>
          <Textarea
            isReadOnly
            className="w-full"
            defaultValue="Jane and Mary requested the year end budget review from you; deadline 25 Jan 2025."
            label="Email thread with Jane and Mary"
            labelPlacement="outside"
            placeholder="Enter your description"
            variant="bordered"
          />
          <Textarea
            isReadOnly
            className="w-full"
            defaultValue="CEO Vincent complimented your work ethic and responsibility. Mentioned to keep up the good work."
            label="Email thread with Vincent"
            labelPlacement="outside"
            placeholder="Enter your description"
            variant="bordered"
          />
        </>
      ) : (
        <p className="text-sm/6 text-gray-600">No other summarised threads.</p>
      )}
    </div>
  );
};
