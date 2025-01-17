import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { getCalendarEvents } from "../services/api";

export const CalendarContent = ({ selectedDates }) => {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  const formatToISODateTime = (day, month, year, time) => {
    if (!day || !month || !year) return null;

    const paddedDay = String(day).padStart(2, "0");
    const paddedMonth = String(month).padStart(2, "0");

    const dateString = `${year}-${paddedMonth}-${paddedDay}T${time}`;
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return null;
    }
    return date.toISOString();
  };

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
    console.log(startDateTime, endDateTime);
  }, [startDateTime, endDateTime]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!startDateTime || !endDateTime) return;

      setLoading(true);
      setError(null);
      try {
        const data = await getCalendarEvents(
          userId,
          startDateTime,
          endDateTime
        );
        setEvents(data);
      } catch (err) {
        console.error("Error fetching calendar events:", err);
        setError("Failed to fetch events.");
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
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : events && events.length > 0 ? (
        <div className="w-full max-w-lg p-4 border rounded-lg bg-white shadow-md">
          <h2 className="mb-4">
            Events from {startDateTime} to {endDateTime}
          </h2>
          <ul className="space-y-3">
            {events.map((event, index) => (
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
          No events for the selected date range.
        </p>
      )}
    </div>
  );
};
