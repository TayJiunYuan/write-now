import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export const MeetingList = ({ meetings, title }) => {
  useEffect(() => {
    console.log("this is the title", title);
  }, [title]);
  return (
    <div>
      {meetings.map((meeting, index) => {
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
                <button
                  className="text-blue-500 underline"
                  onClick={() => viewMeetingDetails(meeting)}
                >
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

const viewMeetingDetails = (meeting) => {
  console.log("Viewing details for meeting:", meeting);
};
