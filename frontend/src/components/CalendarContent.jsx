import React from "react";

export const CalendarContent = ({ selectedDate, userCalendarEvents }) => {
  return (
    <div className="flex flex-col h-full justify-center items-center">
      {userCalendarEvents ? (
        <div className="w-full max-w-lg p-4 border rounded-lg bg-white shadow-md">
          <h2 className="mb-4">
            Events for {"2025-01-15"}
          </h2>
          <ul className="space-y-3">
            {Object.values(userCalendarEvents)[0].map((event, index) => (
              <li
                key={index}
                className="p-4 border rounded-lg shadow-sm bg-gray-50"
              >
                <p className="font-medium">{event.time}</p>
                <p className="text-gray-600">{event.title}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm/6 text-gray-600">
          No events for the selected date.
        </p>
      )}
    </div>
  );
};
