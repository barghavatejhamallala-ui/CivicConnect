import {
  ArrowLeft,
  MapPin,
  Clock3,
  AlertTriangle,
  User,
  Building2,
  Play,
  CheckCircle2,
  ImagePlus,
  Camera,
  Trash2,
} from "lucide-react";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import Sidebar from "../components/Sidebar";
import PageTransition from "../components/PageTransition";
import {
  MAX_PROGRESS_PHOTOS,
  addProgressPhoto,
  compressImage,
  completeTask as saveTaskCompletion,
  getTaskUpdate,
  removeProgressPhoto,
  setCompletionPhoto,
  startTask as saveTaskStart,
} from "../../../shared/workPhotos.js";

import "../styles/taskDetails.css";

function TaskDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const task = location.state?.task;

  // Status + photos come from the shared store, so they survive a reload and
  // are the same data the Authority and Citizen portals read.
  const [update, setUpdate] = useState(() =>
    task ? getTaskUpdate(task.id) : null
  );
  const taskStatus = update ? update.status : "Pending";

  const [imageZoomed, setImageZoomed] = useState(false);
  const [caption, setCaption] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [uploading, setUploading] = useState(false);
  const progressInput = useRef(null);
  const completionInput = useRef(null);

  const progressPhotos = update?.progressPhotos || [];
  const completionPhoto = update?.completionPhoto || null;
  const canEditPhotos = taskStatus === "In Progress";

  /* Runs a store write and reports a problem (photo limit, network, ...) to the worker. */
  const applyResult = (result) => {
    if (result.update) setUpdate(result.update);
    if (!result.ok) {
      setPhotoError(
        result.full
          ? `You can add up to ${MAX_PROGRESS_PHOTOS} progress photos.`
          : result.error || "Could not save this change. Please try again."
      );
      return false;
    }
    setPhotoError("");
    return true;
  };

  const pickPhoto = async (event, onReady) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const src = await compressImage(file);
      await onReady(src);
    } catch (error) {
      setPhotoError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleProgressPhoto = (event) =>
    pickPhoto(event, async (src) => {
      if (applyResult(await addProgressPhoto(task.id, { src, caption }))) setCaption("");
    });

  const handleCompletionPhoto = (event) =>
    pickPhoto(event, async (src) => applyResult(await setCompletionPhoto(task.id, src)));

  const handleRemovePhoto = async (id) => applyResult(await removeProgressPhoto(task.id, id));

  /* =========================================================
     TASK LOCATIONS
     ========================================================= */

  const taskPosition = task?.coords || [17.6868, 83.2185];

  /* =========================================================
     TASK NOT FOUND
     ========================================================= */

  if (!task) {
    return (
      <PageTransition>
        <Sidebar />

        <div className="app-shell">
          <main className="page-content task-details-page">

            <div className="task-not-found">

              <h1>Task Not Found</h1>

              <p>
                Please select a task from the Assigned Tasks page.
              </p>

              <button
                onClick={() =>
                  navigate("/assigned-tasks")
                }
              >
                <ArrowLeft size={17} />
                Back to Assigned Tasks
              </button>

            </div>

          </main>

        </div>
      </PageTransition>
    );
  }

  /* =========================================================
     START TASK
     ========================================================= */

  const startTask = async () => {
    setUploading(true);
    applyResult(await saveTaskStart(task.id));
    setUploading(false);
  };

  /* =========================================================
     COMPLETE TASK
     ========================================================= */

  const completeTask = async () => {

    /* A completion photo is the proof of work the authority and citizen see */

    if (!completionPhoto) {
      setPhotoError("Upload a completion photo before completing the task.");
      return;
    }

    setUploading(true);
    const ok = applyResult(await saveTaskCompletion(task.id));
    setUploading(false);
    if (ok) navigate("/history");
  };

  return (
    <PageTransition>

      <Sidebar />

      <div className="app-shell">

        <main className="page-content task-details-page">

          {/* =====================================================
              BACK BUTTON
              ===================================================== */}

          <motion.button
            className="task-back-button"

            onClick={() =>
              navigate("/assigned-tasks")
            }

            initial={{
              opacity: 0,
              x: -15,
            }}

            animate={{
              opacity: 1,
              x: 0,
            }}

            transition={{
              duration: 0.35,
            }}
          >

            <ArrowLeft size={18} />

            Back to Assigned Tasks

          </motion.button>


          {/* =====================================================
              HEADER
              ===================================================== */}

          <motion.div
            className="task-details-header"

            initial={{
              opacity: 0,
              y: -15,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.4,
            }}
          >

            <div>

              <p className="task-details-label">
                TASK DETAILS
              </p>

              <h1>
                {task.title}
              </h1>

              <p>
                Review and complete the assigned work.
              </p>

            </div>

            <span
              className={`task-details-priority ${task.priorityClass}`}
            >

              <AlertTriangle size={15} />

              {task.priority} Priority

            </span>

          </motion.div>


          {/* =====================================================
              MAIN CONTENT
              ===================================================== */}

          <section className="task-details-layout">


            {/* ===================================================
                LEFT SIDE
                =================================================== */}

            <div className="task-details-left">


              {/* =================================================
                  BEFORE IMAGE
                  ================================================= */}

              <motion.div
                className="task-details-image-card"

                initial={{
                  opacity: 0,
                  x: -20,
                }}

                animate={{
                  opacity: 1,
                  x: 0,
                }}

                transition={{
                  duration: 0.45,
                }}
              >

                <div className="task-details-image-wrapper">

                  <img
                    src={task.image}
                    alt={task.title}

                    className={`task-details-image ${
                      imageZoomed
                        ? "image-zoomed"
                        : ""
                    }`}

                    onClick={() =>
                      setImageZoomed(!imageZoomed)
                    }
                  />

                  <span className="before-image-label">
                    BEFORE
                  </span>

                </div>

              </motion.div>



              {/* =================================================
                  WORK PHOTOS (visible to authority + citizen)
                  ================================================= */}

              <motion.section
                className="work-photos-section"

                initial={{
                  opacity: 0,
                  y: 20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay: 0.12,
                  duration: 0.45,
                }}
              >

                <div className="section-heading">

                  <div>

                    <h2>
                      Work Photos
                    </h2>

                    <p>
                      Photos you upload here are shown to the authority and the citizen who reported this issue.
                    </p>

                  </div>

                </div>

                {taskStatus === "Pending" && (
                  <p className="work-photos-hint">
                    Start the task to begin uploading progress photos.
                  </p>
                )}

                {taskStatus !== "Pending" && (
                  <>

                    {/* PROGRESS PHOTOS */}

                    <div className="work-photos-block">

                      <div className="work-photos-block-head">
                        <h3>Progress photos</h3>
                        <span>
                          {progressPhotos.length}/{MAX_PROGRESS_PHOTOS}
                        </span>
                      </div>

                      <div className="work-photos-grid">

                        {progressPhotos.map((photo) => (
                          <figure className="work-photo" key={photo.id}>
                            <img src={photo.src} alt={photo.caption} />
                            <figcaption>{photo.caption}</figcaption>

                            {canEditPhotos && (
                              <button
                                type="button"
                                className="work-photo-remove"
                                onClick={() => handleRemovePhoto(photo.id)}
                                aria-label="Remove this photo"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </figure>
                        ))}

                        {canEditPhotos && progressPhotos.length < MAX_PROGRESS_PHOTOS && (
                          <button
                            type="button"
                            className="work-photo-add"
                            onClick={() => progressInput.current?.click()}
                            disabled={uploading}
                          >
                            <ImagePlus size={24} />
                            <span>{uploading ? "Uploading..." : "Add progress photo"}</span>
                          </button>
                        )}

                      </div>

                      {canEditPhotos && (
                        <input
                          type="text"
                          className="work-photo-caption"
                          placeholder="Caption for the next photo (optional)"
                          maxLength={80}
                          value={caption}
                          onChange={(event) => setCaption(event.target.value)}
                        />
                      )}

                      {!canEditPhotos && progressPhotos.length === 0 && (
                        <p className="work-photos-hint">No progress photos were uploaded.</p>
                      )}

                      <input
                        ref={progressInput}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        hidden
                        onChange={handleProgressPhoto}
                      />

                    </div>

                    {/* COMPLETION PHOTO */}

                    <div className="work-photos-block">

                      <div className="work-photos-block-head">
                        <h3>Completion photo</h3>
                        <span className={completionPhoto ? "work-photos-ok" : ""}>
                          {completionPhoto ? "Added" : "Required"}
                        </span>
                      </div>

                      {completionPhoto ? (
                        <figure className="work-photo work-photo-wide">
                          <img src={completionPhoto.src} alt="Completed work" />
                          <figcaption>Work completed</figcaption>

                          {canEditPhotos && (
                            <button
                              type="button"
                              className="work-photo-retake"
                              onClick={() => completionInput.current?.click()}
                              disabled={uploading}
                            >
                              <Camera size={15} />
                              Replace
                            </button>
                          )}
                        </figure>
                      ) : canEditPhotos ? (
                        <button
                          type="button"
                          className="work-photo-add work-photo-add-wide"
                          onClick={() => completionInput.current?.click()}
                          disabled={uploading}
                        >
                          <Camera size={26} />
                          <span>{uploading ? "Uploading..." : "Upload completion photo"}</span>
                          <small>Show the finished work to close this task</small>
                        </button>
                      ) : (
                        <p className="work-photos-hint">No completion photo.</p>
                      )}

                      <input
                        ref={completionInput}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        hidden
                        onChange={handleCompletionPhoto}
                      />

                    </div>

                  </>
                )}

                {photoError && (
                  <p className="work-photos-error" role="alert">
                    {photoError}
                  </p>
                )}

              </motion.section>

              {/* =================================================
                  WORK TIMELINE
                  ================================================= */}

              <motion.section
                className="work-timeline-section"

                initial={{
                  opacity: 0,
                  y: 20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay: 0.2,
                  duration: 0.45,
                }}
              >

                <div className="section-heading">

                  <div>

                    <h2>
                      Work Timeline
                    </h2>

                    <p>
                      Track the progress of this assigned task.
                    </p>

                  </div>

                </div>


                <div className="timeline">

                  {/* TASK ASSIGNED */}

                  <div className="timeline-item active">

                    <div className="timeline-dot">

                      <CheckCircle2 size={16} />

                    </div>

                    <div>

                      <strong>
                        Task Assigned
                      </strong>

                      <span>
                        Task has been assigned to the worker.
                      </span>

                    </div>

                  </div>


                  {/* LINE */}

                  <div
                    className={`timeline-line ${
                      taskStatus !== "Pending"
                        ? "timeline-active"
                        : ""
                    }`}
                  />


                  {/* WORK STARTED */}

                  <div
                    className={`timeline-item ${
                      taskStatus !== "Pending"
                        ? "active"
                        : ""
                    }`}
                  >

                    <div className="timeline-dot">

                      {taskStatus !== "Pending" ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        "2"
                      )}

                    </div>

                    <div>

                      <strong>
                        Work Started
                      </strong>

                      <span>

                        {taskStatus !== "Pending"
                          ? "Worker has started working on this task."
                          : "Waiting for the worker to start."
                        }

                      </span>

                    </div>

                  </div>


                  {/* LINE */}

                  <div
                    className={`timeline-line ${
                      taskStatus === "Completed"
                        ? "timeline-active"
                        : ""
                    }`}
                  />


                  {/* COMPLETED */}

                  <div
                    className={`timeline-item ${
                      taskStatus === "Completed"
                        ? "active"
                        : ""
                    }`}
                  >

                    <div className="timeline-dot">

                      {taskStatus === "Completed" ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        "3"
                      )}

                    </div>

                    <div>

                      <strong>
                        Task Completed
                      </strong>

                      <span>

                        {taskStatus === "Completed"
                          ? "The assigned work has been completed."
                          : "Complete the work to finish this task."
                        }

                      </span>

                    </div>

                  </div>

                </div>

              </motion.section>

            </div>


            {/* ===================================================
                RIGHT SIDE
                =================================================== */}

            <motion.div
              className="task-details-info-card"

              initial={{
                opacity: 0,
                x: 20,
              }}

              animate={{
                opacity: 1,
                x: 0,
              }}

              transition={{
                duration: 0.45,
              }}
            >


              {/* =================================================
                  STATUS
                  ================================================= */}

              <div className="task-status-row">

                <span
                  className={`task-detail-status ${
                    taskStatus === "Completed"
                      ? "completed"
                      : taskStatus === "In Progress"
                      ? "in-progress"
                      : "pending"
                  }`}
                >

                  {taskStatus}

                </span>


                <span className="task-detail-time">

                  <Clock3 size={15} />

                  {task.time}

                </span>

              </div>


              {/* =================================================
                  WORK LOCATION
                  ================================================= */}

              <div className="detail-info-item">

                <div className="detail-icon">

                  <MapPin size={19} />

                </div>

                <div>

                  <span>
                    Work Location
                  </span>

                  <strong>
                    {task.location}
                  </strong>

                </div>

              </div>


              {/* =================================================
                  MAP
                  ================================================= */}

              <div className="task-map-section">

                <div className="task-map-header">

                  <div>

                    <h3>
                      Work Location Map
                    </h3>

                    <p>
                      {task.location}
                    </p>

                  </div>

                </div>


                <MapContainer
                  center={taskPosition}
                  zoom={15}
                  scrollWheelZoom={true}
                  className="task-map"
                >

                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <Marker
                    position={taskPosition}
                  >

                    <Popup>

                      <strong>
                        {task.title}
                      </strong>

                      <br />

                      {task.location}

                    </Popup>

                  </Marker>

                </MapContainer>

              </div>


              {/* =================================================
                  AUTHORITY
                  ================================================= */}

              <div className="detail-info-item">

                <div className="detail-icon">

                  <User size={19} />

                </div>

                <div>

                  <span>
                    Assigned By
                  </span>

                  <strong>
                    Municipal Authority
                  </strong>

                </div>

              </div>


              {/* =================================================
                  DEPARTMENT
                  ================================================= */}

              <div className="detail-info-item">

                <div className="detail-icon">

                  <Building2 size={19} />

                </div>

                <div>

                  <span>
                    Department
                  </span>

                  <strong>
                    Municipal Services
                  </strong>

                </div>

              </div>


              {/* =================================================
                  START TASK
                  ================================================= */}

              {taskStatus === "Pending" && (

                <button
                  className="start-task-button"
                  onClick={startTask}
                  disabled={uploading}
                >

                  <Play size={17} />

                  Start Task

                </button>

              )}


              {/* =================================================
                  COMPLETE TASK
                  ================================================= */}

              {taskStatus === "In Progress" && (

                <button
                  className="complete-task-button"
                  onClick={completeTask}
                  disabled={!completionPhoto || uploading}
                  title={completionPhoto ? "" : "Upload a completion photo first"}
                >

                  <CheckCircle2 size={17} />

                  Complete Task

                </button>

              )}


              {/* =================================================
                  COMPLETED
                  ================================================= */}

              {taskStatus === "Completed" && (

                <div className="task-completed-message">

                  <CheckCircle2 size={19} />

                  Task Completed Successfully

                </div>

              )}

            </motion.div>

          </section>

        </main>


        {/* =====================================================
            BOTTOM NAVIGATION
            ===================================================== */}


      </div>

    </PageTransition>
  );
}

export default TaskDetails;