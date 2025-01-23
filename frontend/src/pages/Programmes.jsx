import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Skeleton,
  DateRangePicker,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { format } from "date-fns";
import { createNewProgramme, getAllProgrammes } from "../services/api";
import { convertDatePickerToDateOnly } from "../utils/DateFormatters";
import { programmeTypes } from "../constants/ProgrammesElements";
import { CreateProgrammeModal } from "../components/CreateProgrammeModal";

const Programmes = () => {
  const [programmesList, setProgrammesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Programmes");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAllProgrammes();
        setProgrammesList(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filteredEvents = programmesList.filter((event) => {
      let isWithinDateRange;

      if (selectedDates?.start && selectedDates?.end) {
        const eventDateString = format(new Date(event.datetime), "yyyy-MM-dd");
        const formattedStartDate = convertDatePickerToDateOnly(
          selectedDates.start
        );
        const formattedEndDate = convertDatePickerToDateOnly(selectedDates.end);

        isWithinDateRange =
          eventDateString >= formattedStartDate &&
          eventDateString <= formattedEndDate;
      } else {
        isWithinDateRange = true;
      }

      const isInCategory =
        selectedCategory === "All Programmes" ||
        event.type === selectedCategory;

      return isWithinDateRange && isInCategory;
    });

    setFilteredEvents(filteredEvents);
  }, [selectedDates, selectedCategory, programmesList]);

  // default sorting by datetime
  useEffect(() => {
    const sortedEvents = programmesList.sort((a, b) => {
      const dateA = new Date(a.datetime);
      const dateB = new Date(b.datetime);

      return dateA - dateB;
    });
    setFilteredEvents(sortedEvents);
  }, [programmesList]);

  const handleProgTypeChange = (e) => {
    if (!e.target.value) {
      return;
    } else {
      setSelectedCategory(e.target.value);
    }
  };

  const handleCreateProgramme = async (programmeData) => {
    try {
      const createdProgramme = await createNewProgramme(programmeData);
      setProgrammesList((prevProgs) => [...prevProgs, createdProgramme]);
    } catch (error) {
      console.error("Error creating programme:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen container mx-auto pt-[65px]">
      <div className="text-justify my-8 space-y-4">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
        <p className="text-black">
          The Book Council organises festivals, workshops and events related to
          writing, publishing, storytelling, reading and many more. To stay
          updated, join us on our various platforms. The Singapore Book Council
          Academy, our training arm, has a{" "}
          <a
            href="https://www.bookcouncil.sg/sbc-academy"
            className="text-blue-500 underline hover:text-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            comprehensive website
          </a>{" "}
          for the workshops.
        </p>
        <div className="flex justify-between items-center">
          <Button>Past Events</Button>
          <Button size="lg" color="primary" onPress={onOpen}>
            Create Programme
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border-2 flex flex-wrap gap-4 items-center">
        <div className="flex-1">
          <DateRangePicker
            label="Date range"
            value={selectedDates}
            onChange={setSelectedDates}
          />
        </div>
        <div className="flex-1">
          <Select
            label="Programme Type"
            selectedKeys={[selectedCategory]}
            onChange={handleProgTypeChange}
            placeholder="Select a programme type"
          >
            {programmeTypes.map((type) => (
              <SelectItem key={type}>{type}</SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <Skeleton isLoaded={!loading} className="rounded-xl mt-8">
        <div className="mt-8 space-y-6 pb-8">
          {filteredEvents.map((event, index) => {
            const date = new Date(event.datetime);

            const day = date.getDate();
            const month = date.toLocaleDateString("default", {
              month: "short",
            });
            const year = date.getFullYear();
            date.setHours(date.getHours() + 8);
            const time = date.toLocaleDateString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const formattedTime = time.split(",")[1];

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-xl p-6 flex items-center justify-between gap-4"
              >
                <div className="bg-default rounded-xl p-4 flex flex-col justify-center items-center border-2 border-black">
                  <p className="text-xl font-bold">{day}</p>
                  <p className="text-sm font-bold">{month}</p>
                  <p className="text-sm font-bold">{year}</p>
                </div>
                <div className="w-full space-y-1">
                  <h1 className="text-xl font-bold">{event.name}</h1>
                  <p className="mt-1 text-sm font-light">{formattedTime}</p>
                  <p className="text-sm font-light">{event.location}</p>
                  <p className="text-sm font-light">{event.type}</p>
                  <p className="text-medium font-normal text-justify">
                    {event.description}
                  </p>
                </div>
                <Button
                  as={Link}
                  to={`/programmes/${event.id}`}
                  state={{ event }}
                  color="primary"
                  variant="flat"
                >
                  VIEW DETAILS
                </Button>
              </div>
            );
          })}
        </div>
      </Skeleton>
      <CreateProgrammeModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        handleCreateProgramme={handleCreateProgramme}
      />
    </div>
  );
};

export default Programmes;
