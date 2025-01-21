import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { convertISOToPresentableLongDateTime } from "../utils/DateFormatters";

export const MeetingList = ({ meetings, title }) => {
  const sortedMeetings = meetings.sort((a, b) => {
    const dateA = new Date(a.start);
    const dateB = new Date(b.start);

    return dateA - dateB;
  });

  return (
    <div>
      <ol className="space-y-2">
        {sortedMeetings.map((meeting, index) => {
          const formattedDate = convertISOToPresentableLongDateTime(
            meeting.start
          );

          return (
            <li className="flex justify-between items-center">
              <p className="flex-1">{`${index + 1}. ${formattedDate}`}</p>
              <Button
                as={Link}
                to={`/meetings/${meeting.id}`}
                state={{ meeting, title }}
                variant="light"
                color="primary"
                size="sm"
              >
                View Details
              </Button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
