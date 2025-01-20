import React, { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";

import { getCalendarEvents } from "../services/api";
import { formatToISODateTime } from "../utils/DateFormatters";

export const CalendarContent = ({ selectedDates }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  const startDateTime = formatToISODateTime(
    selectedDates?.start?.day,
    selectedDates?.start?.month,
    selectedDates?.start?.year,
    "00:00:00"
  );
  const endDateTime = formatToISODateTime(
    selectedDates?.end?.day,
    selectedDates?.end?.month,
    selectedDates?.end?.year,
    "23:59:59"
  );

  useEffect(() => {
    const fetchEvents = async () => {
      if (!startDateTime || !endDateTime) return;

      setLoading(true);
      try {
        const data = await getCalendarEvents(
          userId,
          startDateTime,
          endDateTime
        );
        setEvents(data);
      } catch (err) {
        console.error("Error fetching calendar events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [startDateTime, endDateTime, userId]);

  return (
    <div className="flex flex-col h-full justify-center items-center">
      {loading ? (
        <Spinner />
      ) : events && events.length > 0 ? (
        <div className="w-full max-w-lg p-4 border rounded-lg bg-white shadow-md">
          <p className="text-sm/6 text-gray-600 mb-4">
            You have {events.length} {events.length === 1 ? "event" : "events"}{" "}
            today.
          </p>
          <ul className="space-y-3">
            {events.map((event, index) => (
              <li
                key={event.id || index}
                className="p-4 border rounded-lg shadow-sm bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {event.summary || "No Title"}
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Start:</span>
                  {new Date(event.start_time).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">End:</span>
                  {new Date(event.end_time).toLocaleString()}
                </p>
                <a
                  href={event.html_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm"
                >
                  View on Calendar
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm/6 text-gray-600">
          No events for the selected date range.
        </p>
      )}
    </div>
  );
};
