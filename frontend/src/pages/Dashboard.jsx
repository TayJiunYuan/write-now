import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  RangeCalendar,
  Spinner,
} from "@heroui/react";
import { CalendarSearch } from "lucide-react";
import { TaskTable } from "../components/TaskTable";
import { EmailSummary } from "../components/EmailSummary";
import { CalendarContent } from "../components/CalendarContent";
import { getUserByIdWithoutCredentials } from "../services/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState([null, null]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await getUserByIdWithoutCredentials(userId);
        setUser(response);
      } catch (err) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="container mx-auto p-4 pt-[65px]">
          <h2 className="p-4 text-3xl font-bold text-primary">
            Welcome back, {user.name}.
          </h2>

          <div className="grid lg:grid-rows-2 lg:grid-cols-3 h-full gap-4 p-4">
            {/* top left */}
            <div className="relative lg:col-span-2 lg:row-start-1 bg-white rounded-lg h-[40vh] shadow-md">
              <div className="flex h-full flex-col">
                <div className="px-6 pt-6">
                  <p className="text-lg font-medium tracking-tight text-gray-950">
                    Tasks
                  </p>
                </div>
                <div className="overflow-auto w-full [container-type:inline-size] p-4">
                  <TaskTable />
                </div>
              </div>
            </div>

            {/* bottom left */}
            <div className="relative lg:col-span-2 lg:row-start-2 bg-white rounded-lg h-[40vh] shadow-md">
              <div className="flex h-full flex-col gap-4">
                <div className="flex flex-col px-6 pt-6 gap-2">
                  <p className="text-lg font-medium tracking-tight text-gray-950">
                    Email Summaries
                  </p>
                  <p className="text-sm/6 text-gray-600">
                    Displaying last 10 emails
                  </p>
                </div>
                <div className="overflow-auto w-full [container-type:inline-size] px-6 pb-6">
                  <EmailSummary />
                </div>
              </div>
            </div>

            {/* right */}
            <div className="relative lg:row-span-2 bg-white rounded-lg shadow-md">
              <div className="relative flex h-full flex-col">
                <div className="flex justify-between px-6 pt-6">
                  <p className="text-lg font-medium tracking-tight text-gray-950">
                    Schedule for Selected Range
                  </p>
                  <Popover placement="bottom" showArrow={true}>
                    <PopoverTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        radius="full"
                        color="primary"
                        startContent={<CalendarSearch size={20} />}
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="px-1 py-2">
                        <RangeCalendar
                          showMonthAndYearPickers
                          aria-label="Select a Date Range"
                          onChange={handleDateChange} // When a range is selected, this updates the selectedDates state
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="overflow-auto w-full [container-type:inline-size] p-6">
                  {/* Pass the selectedDates to the CalendarContent component */}
                  <CalendarContent selectedDates={selectedDates} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
