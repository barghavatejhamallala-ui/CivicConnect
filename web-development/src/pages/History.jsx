import {
  CheckCircle2,
  Clock3,
  MapPin,
} from "lucide-react";

import { motion } from "framer-motion";

import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import PageTransition from "../components/PageTransition";

import "../styles/history.css";

function History() {

  const historyTasks = [
    {
      id: 1,
      title: "Road Damage",

      details:
        "Repair damaged road near Main Road.",

      beforeImage: "/images/road-before.jpg",
      afterImage: "/images/road-after.jpg",

      location: "Main Road",
      completedDate: "20 Aug 2026",
      completedTime: "10:30 AM",
    },

    {
      id: 2,
      title: "Garbage Collection",

      details:
        "Collect and clear garbage at Gandhi Park.",

      beforeImage: "/images/garbage-before.jpg",
      afterImage: "/images/garbage-after.jpg",

      location: "Gandhi Park",
      completedDate: "19 Aug 2026",
      completedTime: "02:15 PM",
    },

    {
      id: 3,
      title: "Water Leakage",

      details:
        "Repair water leakage near Market Street.",

      beforeImage: "/images/water-before.jpg",
      afterImage: "/images/water-after.jpg",

      location: "Market Street",
      completedDate: "18 Aug 2026",
      completedTime: "11:45 AM",
    },
  ];

  return (
    <PageTransition>

      <Sidebar />

      <div className="app-shell">

        <main className="page-content history-page">

          {/* =====================================================
              HEADER
              ===================================================== */}

          <motion.div
            className="history-header"

            initial={{
              opacity: 0,
              y: -15,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.45,
            }}
          >

            <div>

              <h1>Task History</h1>

              <p>
                View your completed civic tasks and work results.
              </p>

            </div>


            <div className="history-count">

              <strong>
                {historyTasks.length}
              </strong>

              <span>
                Completed
              </span>

            </div>

          </motion.div>


          {/* =====================================================
              HISTORY CARDS
              ===================================================== */}

          <section className="history-grid">

            {historyTasks.map((task, index) => (

              <motion.article
                key={task.id}
                className="history-card"

                initial={{
                  opacity: 0,
                  y: 20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay: index * 0.1,
                  duration: 0.4,
                }}

                whileHover={{
                  y: -5,
                }}
              >

                {/* =================================================
                    TASK NAME
                    ================================================= */}

                <div className="history-card-heading">

                  <h2>
                    {task.title}
                  </h2>

                  <span className="completed-badge">

                    <CheckCircle2 size={14} />

                    Completed

                  </span>

                </div>


                {/* =================================================
                    TASK DETAILS
                    ================================================= */}

                <div className="history-task-details">

                  <span>
                    Task Details
                  </span>

                  <p>
                    {task.details}
                  </p>

                </div>


                {/* =================================================
                    BEFORE IMAGE
                    ================================================= */}

                <div className="history-image-section">

                  <div className="history-image-title">
                    BEFORE
                  </div>

                  <div className="history-image-box">

                    <img
                      src={task.beforeImage}
                      alt={`${task.title} before`}
                    />

                  </div>

                </div>


                {/* =================================================
                    AFTER IMAGE
                    ================================================= */}

                <div className="history-image-section">

                  <div className="history-image-title after-title">
                    AFTER
                  </div>

                  <div className="history-image-box">

                    <img
                      src={task.afterImage}
                      alt={`${task.title} after`}
                    />

                  </div>

                </div>


                {/* =================================================
                    LOCATION
                    ================================================= */}

                <div className="history-location">

                  <MapPin size={15} />

                  <span>
                    {task.location}
                  </span>

                </div>


                {/* =================================================
                    COMPLETION INFORMATION
                    ================================================= */}

                <div className="history-completion">

                  <div>

                    <span>
                      Completed Date
                    </span>

                    <strong>
                      {task.completedDate}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Time
                    </span>

                    <strong>
                      {task.completedTime}
                    </strong>

                  </div>

                </div>


                <div className="history-status">

                  <Clock3 size={14} />

                  Work completed successfully

                </div>

              </motion.article>

            ))}

          </section>

        </main>


        <BottomNav />

      </div>

    </PageTransition>
  );
}

export default History;