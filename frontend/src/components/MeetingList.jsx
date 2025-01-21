import React from "react";
import { Link } from "react-router-dom";

export const MeetingList = ({ meetings, title }) => {
  const sortedEvents = meetings.sort((a, b) => {
    const dateA = new Date(a.start);
    const dateB = new Date(b.start);

    return dateA - dateB;
  });

  return (
    <div>
      {sortedEvents.map((meeting, index) => {
        const startDate = new Date(meeting.start);

        const formattedDate = startDate.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        return (
          <div key={index}>
            <p>
              {formattedDate} -{" "}
              <Link to={`/meetings/${meeting.id}`} state={{ meeting, title }}>
                <button className="text-blue-500 underline">
                  View Details
                </button>
              </Link>
            </p>
          </div>
        );
      })}
    </div>
  );
};
