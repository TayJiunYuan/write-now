import { format } from "date-fns";

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

export const convertDatePickerToDateOnly = (dateObject) => {
  const { year, month, day } = dateObject;
  return format(new Date(year, month - 1, day), "yyyy-MM-dd");
};
