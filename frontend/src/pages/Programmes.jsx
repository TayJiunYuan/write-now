import React, { useEffect, useState } from "react";
import { categories } from "../constants/ProgrammesElements";
import { Link } from "react-router-dom";
import { getAllProgrammes, getUsers } from "../services/api";

const Programmes = () => {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [programmes, setProgrammes] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllProgrammes();
      setProgrammes(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filterEventsByDate = (selectedDate) => {
    if (!selectedDate) return programmes;

    return programmes.filter((event) => {
      console.log(event.datetime);
      const programmeDate = event.datetime;
      const eventDateString = programmeDate.split("T")[0];
      return eventDateString === selectedDate;
    });
  };

  const filterEventsByCategory = (selectedCategory) => {
    if (selectedCategory === "All Programmes") return programmes;

    return programmes.filter((programme) => {
      console.log(programme);
      return programme.type === selectedCategory;
    });
  };

  const formatMonth = (month) => {
    const monthMap = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    return monthMap[month] || "01"; // Default to '01' if invalid month (though you shouldn't get this)
  };

  useEffect(() => {
    console.log(selectedDate);
    setFilteredEvents(filterEventsByDate(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    console.log(selectedCategory);
    setFilteredEvents(filterEventsByCategory(selectedCategory));
  }, [selectedCategory]);

  useEffect(() => {
    setFilteredEvents(programmes);
    console.log(programmes);
  }, [programmes]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen container mx-auto">
      <div className="text-left mb-8 pt-8">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
        <p className="mt-2 text-black">
          The Book Council organises festivals, workshops and events related to
          writing, publishing, storytelling, reading and many more. To stay
          updated, join us on our various platforms. The Singapore Book Council
          Academy, our training arm, has a{" "}
          <a
            href="https://www.bookcouncil.sg/sbc-academy"
            className="text-blue-500 underline hover:text-blue-600"
          >
            comprehensive website
          </a>{" "}
          for the workshops.
        </p>
        <button className="mt-4 px-4 py-2 border border-red-500 text-black hover:bg-red-500 hover:text-white transition">
          Past Events
        </button>
      </div>

      <div className="bg-rose-300 rounded-md p-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="pl-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-rose-500 focus:ring-rose-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category-select"
            className="pl-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-rose-500 focus:ring-rose-500"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Filter by Event
          </label>
          <input
            type="text"
            placeholder="Search"
            className="pl-2 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-rose-500 focus:ring-rose-500"
          />
        </div>
      </div>

      <div className="mt-8 space-y-6 pb-8">
        {filteredEvents.map((event, index) => {
          const date = new Date(event.datetime);
          const day = date.getDate();
          const month = date.toLocaleDateString("default", { month: "short" });
          const year = date.getFullYear();

          return (
            <div
              key={index}
              className="bg-white rounded-md shadow-md p-6 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-md p-4 text-center w-16">
                  <p className="text-xl font-bold">{day}</p>
                  <p className="text-sm text-gray-600">{month}</p>
                  <p className="text-sm text-gray-600">{year}</p>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold">{event.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{event.time}</p>
                  <p className="mt-1 text-sm text-gray-600">{event.location}</p>
                  <p className="mt-1 text-sm text-gray-600">{event.type}</p>
                  <p className="mt-2 text-gray-700 max-w-6xl">
                    {event.description}
                  </p>
                </div>
              </div>
              <Link
                key={index}
                to={`/programmes/${event.id}`}
                state={{ event }}
              >
                <button className="px-4 py-2 border border-red-500 text-black hover:bg-red-500 hover:text-white transition max-w-56">
                  VIEW DETAILS
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Programmes;
