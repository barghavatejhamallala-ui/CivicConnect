/* ==========================================================================
   Shared complaint store for the Authority Portal.

   Every page (Dashboard, Complaints, Assign Worker, Pending, Completed,
   Tracking, Profile) reads from here, so assigning a worker on one page is
   reflected everywhere. Data is loaded from the API into this store
   (see loadAuthorityData); pages read it synchronously.

   Status flow:  New -> Pending -> In Progress -> Completed
     New          reported by a citizen, no worker yet
     Pending      worker assigned, has not started
     In Progress  worker has started (uploads progress photos)
     Completed    resolved

   Worker photos live on the complaint:
     progressPhotos: [{ src, caption, at }]   completionPhoto: "url"
   ========================================================================== */

import { api, assetUrl } from "../../../shared/api.js";
import { setWorkers, positionForKey, nearestWard, MAP_SIZE } from "./workers";

export const STATUS_LIST = ["New", "Pending", "In Progress", "Completed"];

/* Authority statuses -> the wording used on the Tracking page */
export const TRACKING_STATUS = {
  New: "Submitted",
  Pending: "Assigned",
  "In Progress": "In Progress",
  Completed: "Completed",
};

/* ------------------------------------------------------------------ dates */

function isoDay(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(iso) {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export function relativeDay(iso) {
  if (!iso) return "—";
  const today = new Date(`${isoDay(0)}T00:00:00`);
  const date = new Date(`${iso}T00:00:00`);
  const days = Math.round((today - date) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export function priorityLabel(priority) {
  return `${priority} priority`;
}

/* --------------------------------------------------------------- API mapping */

const CATEGORY_VIEW = {
  road: { category: "Road", title: "Road Damage", image: "/road-image.jpg" },
  light: { category: "Electricity", title: "Street Light", image: "/brokenstreetlights.jpg" },
  garbage: { category: "Garbage", title: "Garbage Collection Issue", image: "/garbage-image.jpg" },
  water: { category: "Water", title: "Water Supply Problem", image: "/water-image.jpg" },
  other: { category: "Other", title: "Civic Issue", image: "/road-image.jpg" },
};

const STATUS_VIEW = {
  submitted: { status: "New", progress: 10 },
  review: { status: "New", progress: 10 },
  assigned: { status: "Pending", progress: 25 },
  progress: { status: "In Progress", progress: 60 },
  resolved: { status: "Completed", progress: 100 },
};

const day = (iso) => (iso ? String(iso).slice(0, 10) : null);

/* The city map is a simple km grid. Real GPS coordinates are projected onto it
   around a fixed city window; complaints without coordinates get a stable spot. */
const CITY = { lat: [17.34, 17.44], lng: [78.43, 78.53] };
function pointFor(c) {
  if (!c.coords) return positionForKey(c.id);
  const fx = (c.coords.lng - CITY.lng[0]) / (CITY.lng[1] - CITY.lng[0]);
  const fy = (CITY.lat[1] - c.coords.lat) / (CITY.lat[1] - CITY.lat[0]);
  const clamp = (v, max) => Math.min(max - 0.5, Math.max(0.5, v));
  return { x: clamp(fx * MAP_SIZE.width, MAP_SIZE.width), y: clamp(fy * MAP_SIZE.height, MAP_SIZE.height) };
}

function fromApi(c) {
  const cat = CATEGORY_VIEW[c.category] || CATEGORY_VIEW.other;
  const view = STATUS_VIEW[c.status] || STATUS_VIEW.submitted;
  const point = pointFor(c);
  const progress = (c.workPhotos?.progress || []).map((p) => ({
    id: p.id,
    src: assetUrl(p.url),
    caption: p.caption || "Work in progress",
    at: day(p.createdAt),
  }));
  return {
    id: c.id,
    title: cat.title,
    category: cat.category,
    location: c.location,
    ward: c.location,
    wardZone: nearestWard(point),
    point,
    status: view.status,
    priority: c.priority || "Medium",
    image: assetUrl(c.photo) || cat.image,
    description: c.description,
    citizenName: c.citizen?.name || "Citizen",
    citizenContact: c.citizen?.mobile || c.citizen?.email || "—",
    reportedOn: day(c.createdAt),
    progress: view.progress,
    assignedWorkerId: c.worker?.workerId || null,
    assignedWorkerName: c.worker?.name || null,
    assignedOn: day(c.assignedOn),
    expectedBy: day(c.expectedBy),
    completedOn: day(c.completedOn),
    note: c.note || "",
    progressPhotos: progress,
    completionPhoto: c.workPhotos?.completion ? assetUrl(c.workPhotos.completion.url) : null,
  };
}

/* ------------------------------------------------------------------- store */

let complaints = [];
let loaded = false;
let signature = "";

export const hasAuthorityData = () => loaded;

/** Fetches complaints and the worker roster into the store. */
export async function loadAuthorityData() {
  const client = api("authority");
  const [list, workers] = await Promise.all([
    client.get("/api/authority/complaints"),
    client.get("/api/authority/workers"),
  ]);
  if (!list.ok) return { ok: false, error: list.error };
  if (!workers.ok) return { ok: false, error: workers.error };

  const next = list.data.filter((c) => c.status !== "rejected");
  const nextSignature = JSON.stringify([
    next.map((c) => [c.id, c.status, c.updatedAt, c.priority]),
    workers.data.map((w) => w.workerId),
  ]);
  complaints = next.map(fromApi);
  setWorkers(workers.data);
  const changed = nextSignature !== signature;
  signature = nextSignature;
  loaded = true;
  return { ok: true, changed };
}

export function getComplaints() {
  return complaints.map((complaint) => ({ ...complaint }));
}

export function getComplaintById(id) {
  const found = complaints.find((complaint) => complaint.id === id);
  return found ? { ...found } : null;
}

/* Assigns a worker to a New complaint -> Pending. Throws an Error with the
   server's message if it is refused. */
export async function assignWorker(id, { workerId, priority, note }) {
  const res = await api("authority").post(`/api/authority/complaints/${encodeURIComponent(id)}/assign`, {
    workerId,
    priority,
    note: note || undefined,
  });
  if (!res.ok) throw new Error(res.error);
  const updated = fromApi(res.data);
  complaints = complaints.map((complaint) => (complaint.id === id ? updated : complaint));
  signature = "";
  return { ...updated };
}
