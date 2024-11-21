import { format, toZonedTime } from "date-fns-tz";

export const convertToWIB = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const timeZone = "Asia/Jakarta"; // Timezone for WIB

  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, "yyyy-MM-dd HH:mm:ss", { timeZone });
};
