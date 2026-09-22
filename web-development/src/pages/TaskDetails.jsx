import {
  ArrowLeft,
  MapPin,
  Clock3,
  AlertTriangle,
  User,
  Building2,
  Play,
  CheckCircle2,
} from "lucide-react";

import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import PageTransition from "../components/PageTransition";

import "../styles/taskDetails.css";

function TaskDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const task = location.state?.task;

  const [taskStatus, setTaskStatus] = useState("Pending");
  const [imageZoomed, setImageZoomed] = useState(false);

  /* =========================================================
     TASK LOCATIONS
     ========================================================= */

  const taskLocations = {
    "Road Damage": [17.6868, 83.2185],
    "Garbage Collection": [17.6868, 83.2185],
    "Water Leakage": [17.6868, 83.2185],
  };

  const taskPosition =
    taskLocations[task?.title] || [17.6868, 83.2185];

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

          <BottomNav />
        </div>
      </PageTransition>
    );
  }

  /* =========================================================
     START TASK
     ========================================================= */

  const startTask = () => {
    setTaskStatus("In Progress");
  };

  /* =========================================================
     COMPLETE TASK
     ========================================================= */

  const completeTask = () => {

    setTaskStatus("Completed");

    /* Get existing history */

    const existingHistory =
      JSON.parse(
        localStorage.getItem("completedTasks")
      ) || [];

    /* Check if task is already completed */

    const alreadyCompleted =
      existingHistory.some(
        (item) => item.id === task.id
      );

    /* Save task only if it is not already in history */

    if (!alreadyCompleted) {

      const completedTask = {

        ...task,

        /* BEFORE IMAGE */

        beforeImage: task.image,

        /* AFTER IMAGE */

        afterImage:
          task.title === "Road Damage"
            ? "/images/road-after.jpg"
            : task.title === "Garbage Collection"
            ? "/images/garbage-after.jpg"
            : "/images/water-after.jpg",

        /* COMPLETION DATE */

        completedDate:
          new Date().toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          ),

        /* COMPLETION TIME */

        completedTime:
          new Date().toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),

        /* TASK DETAILS */

        details:
          task.title === "Road Damage"
            ? "Repair damaged road near Main Road."
            : task.title === "Garbage Collection"
            ? "Collect and clear garbage at Gandhi Park."
            : "Repair water leakage near Market Street.",
      };

      /* Save to browser storage */

      localStorage.setItem(
        "completedTasks",
        JSON.stringify([
          ...existingHistory,
          completedTask,
        ])
      );
    }

    /* =====================================================
       GO TO HISTORY
       ===================================================== */

    navigate("/history");
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

        <BottomNav />

      </div>

    </PageTransition>
  );
}

export default TaskDetails;