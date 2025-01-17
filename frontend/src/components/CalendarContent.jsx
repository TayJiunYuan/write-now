import { useEffect, useState } from "react";
import { getCalendarEvents } from "../services/api"; // Import the API call function

export const CalendarContent = ({ selectedDates, userCalendarEvents }) => {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage

  const [startDate, endDate] = selectedDates; // Destructure startDate and endDate

  useEffect(() => {
    const fetchEvents = async () => {
      console.log(selectedDates)
      if (!startDate || !endDate) return; // Skip if range is not complete

      setLoading(true);
      setError(null);

      try {
        const startTime = `${startDate}T00:00:00`;
        const endTime = `${endDate}T23:59:59`;

        const data = await getCalendarEvents(userId, startTime, endTime);
        setEvents(data); // Assuming the API returns events for the date range
      } catch (err) {
        console.error("Error fetching calendar events:", err);
        setError("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [startDate, endDate, userId]); // Trigger re-fetch when startDate or endDate changes

  return (
    <div className="flex flex-col h-full justify-center items-center">
      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : events ? (
        <div className="w-full max-w-lg p-4 border rounded-lg bg-white shadow-md">
          <h2 className="mb-4">
            Events from {startDate} to {endDate}
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
