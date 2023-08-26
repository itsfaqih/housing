import { format } from "date-fns";

export function formatDateTime(date: Date) {
  return format(date, "dd/MM/yyyy HH:mm");
}
