import { format } from "date-fns"; // converts JS date objects to specified format

// most api responses from BE will be in the ISO 8601 format
// tip: use `new Date(dateTimeResponse)` to convert ISO8601 to JS date obj

// KIV: looking to clean up this function soon
export const formatToISODateTime = (day, month, year, time) => {
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

// converts the value stored by heroUI's DatePicker component and returns it in yyyy-MM-dd
export const convertDatePickerToDateOnly = (dateObject) => {
  const { year, month, day } = dateObject;
  return format(new Date(year, month - 1, day), "yyyy-MM-dd");
};

// converts ISO 8601 to e.g. Sat, 18 Jan 2025, 10:49 pm
export const convertISOToPresentableLongDateTime = (dateTimeString) => {
  const dateObj = new Date(dateTimeString);

  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formattedDate;
};
