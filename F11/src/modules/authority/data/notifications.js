import { ClipboardList, Clock, UserCheck, CircleCheck } from "lucide-react";
import { getComplaints } from "./complaints";

/* localStorage key for which authority notifications have been read. */
export const AUTHORITY_READ_KEY = "civicAuthorityNotificationsRead";

const MAX_NOTIFICATIONS = 30;

/* One notification per complaint, worded by its current status. The key
   includes the status, so a complaint that moves on becomes unread again. */
const WORDING = {
  New: (c) => ({
    title: "New complaint reported",
    text: `${c.title} at ${c.ward}. Assign a worker.`,
    icon: ClipboardList,
    tone: "gold",
    date: c.reportedOn,
  }),
  Pending: (c) => ({
    title: "Worker assigned",
    text: `${c.title} is waiting for the worker to start.`,
    icon: Clock,
    tone: "blue",
    date: c.assignedOn || c.reportedOn,
  }),
  "In Progress": (c) => ({
    title: "Work in progress",
    text: `${c.title} is ${c.progress}% complete.`,
    icon: UserCheck,
    tone: "blue",
    date: c.progressPhotos?.[c.progressPhotos.length - 1]?.at || c.assignedOn || c.reportedOn,
  }),
  Completed: (c) => ({
    title: "Complaint resolved",
    text: `${c.title} at ${c.ward} was completed.`,
    icon: CircleCheck,
    tone: "green",
    date: c.completedOn || c.assignedOn || c.reportedOn,
  }),
};

export function buildAuthorityNotifications() {
  return getComplaints()
    .filter((c) => WORDING[c.status])
    .map((c) => ({
      key: `${c.id}:${c.status}`,
      to: `/complaints/${c.id}`,
      ...WORDING[c.status](c),
    }))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, MAX_NOTIFICATIONS);
}
