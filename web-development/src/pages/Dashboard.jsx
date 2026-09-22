import { useEffect, useState } from "react";
import {
  Bell,
  ArrowRight,
  ClipboardList,
  CheckCircle2,
  Clock3,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import WorkerReadyAnimation from "../components/WorkerReadyAnimation";
import PageTransition from "../components/PageTransition";

import "../styles/dashboard.css";


function Dashboard() {
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);


  const recentTasks = [
    {
      title: "Road Damage",
      location: "Main Road",
      status: "Pending",
      icon: <ClipboardList size={19} />,
      statusClass: "pending",
    },
    {
      title: "Garbage Collection",
      location: "Gandhi Park",
      status: "In Progress",
      icon: <Clock3 size={19} />,
      statusClass: "progress",
    },
    {
      title: "Water Leakage",
      location: "Market Street",
      status: "Completed",
      icon: <CheckCircle2 size={19} />,
      statusClass: "completed",
    },
  ];


  return (
    <PageTransition>

      <div className="dashboard-page">

        <Sidebar />

        <div className="app-shell">

          <main className="app-container">

            <div className="page-content">

              {/* =====================================================
                  HEADER
              ===================================================== */}

              <motion.header
                className="dashboard-header"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >

                <div>

                  <p className="dashboard-eyebrow">
                    WORKER DASHBOARD
                  </p>

                  <h1>
                    {greeting}
                    
                  </h1>

                  <p className="dashboard-subtitle">
                    Stay on top of your assigned civic tasks.
                  </p>

                </div>


                <button
                  className="notification-button"
                  type="button"
                >
                  <Bell size={20} />

                  <span className="notification-dot"></span>
                </button>

              </motion.header>



              {/* =====================================================
                  HERO
                  IMPORTANT:
                  Normal section instead of motion.section.
                  This keeps the navy box stationary.
              ===================================================== */}

              <section className="worker-hero">

                <div className="hero-content">

                  <div className="hero-badge">
                    <span></span>
                    Worker Module
                  </div>


                  <h2>
                    Welcome, <strong>Worker!</strong>
                  </h2>


                  <p>
                    Your work helps keep the community cleaner,
                    safer and better every day.
                  </p>


                  <button
                    className="primary-button gold-button"
                    onClick={() => navigate("/assigned-tasks")}
                  >
                    View Assigned Tasks
                    <ArrowRight size={17} />
                  </button>

                </div>


                <div className="worker-container">

                  {/* Worker image animation stays unchanged */}
                  <WorkerReadyAnimation />

                </div>

              </section>



              {/* =====================================================
                  STATISTICS
              ===================================================== */}

              <div className="stats-grid">

                <motion.div
                  className="stat-card blue"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ y: -4 }}
                >

                  <div className="stat-icon">
                    <ClipboardList size={21} />
                  </div>

                  <div className="stat-info">

                    <p>Assigned Tasks</p>

                    <strong>12</strong>

                  </div>

                </motion.div>



                <motion.div
                  className="stat-card green"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{ y: -4 }}
                >

                  <div className="stat-icon">
                    <CheckCircle2 size={21} />
                  </div>

                  <div className="stat-info">

                    <p>Completed</p>

                    <strong>8</strong>

                  </div>

                </motion.div>



                <motion.div
                  className="stat-card gold"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{ y: -4 }}
                >

                  <div className="stat-icon">
                    <Clock3 size={21} />
                  </div>

                  <div className="stat-info">

                    <p>Pending</p>

                    <strong>4</strong>

                  </div>

                </motion.div>

              </div>



              {/* =====================================================
                  PROGRESS + NEXT TASK
              ===================================================== */}

              <div className="dashboard-grid">


                {/* PROGRESS */}

                <motion.div
                  className="progress-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >

                  <div className="card-heading">

                    <div>

                      <h3>Today's Progress</h3>

                      <p>
                        Keep up the good work
                      </p>

                    </div>

                    <CheckCircle2 size={20} />

                  </div>


                  <div className="progress-content">

                    <div className="progress-ring">

                      <svg
                        viewBox="0 0 120 120"
                        aria-hidden="true"
                      >

                        <circle
                          className="progress-track"
                          cx="60"
                          cy="60"
                          r="50"
                        />

                        <circle
                          className="progress-value"
                          cx="60"
                          cy="60"
                          r="50"
                          strokeDashoffset="104"
                        />

                      </svg>


                      <div className="progress-number">
                        67%
                      </div>

                    </div>


                    <div className="progress-text">

                      <strong>
                        8 of 12 tasks
                      </strong>

                      <p>
                        completed today
                      </p>

                      <span>
                        Great progress!
                      </span>

                    </div>

                  </div>

                </motion.div>



                {/* NEXT TASK */}

                <motion.div
                  className="quick-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >

                  <div className="quick-icon">
                    <ClipboardList size={21} />
                  </div>


                  <div>

                    <p className="quick-label">
                      NEXT TASK
                    </p>

                    <h3>
                      Road Damage
                    </h3>

                    <p>
                      Main Road
                    </p>

                  </div>


                  <button
                    className="quick-arrow"
                    type="button"
                    onClick={() => navigate("/task-details")}
                  >
                    <ArrowRight size={18} />
                  </button>

                </motion.div>

              </div>



              {/* =====================================================
                  RECENT TASKS
              ===================================================== */}

              <section className="recent-section">

                <div className="section-header">

                  <div>

                    <h2 className="section-title">
                      Recent Tasks
                    </h2>

                    <p className="section-subtitle">
                      Your latest assigned work
                    </p>

                  </div>


                  <button
                    className="view-all"
                    type="button"
                    onClick={() => navigate("/assigned-tasks")}
                  >
                    View All
                    <ArrowRight size={15} />
                  </button>

                </div>



                <div className="recent-list">

                  {recentTasks.map((task, index) => (

                    <motion.div
                      className="recent-task"
                      key={task.title}
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: 0.5 + index * 0.08,
                      }}
                      whileHover={{
                        x: 3,
                      }}
                      onClick={() =>
                        navigate("/task-details")
                      }
                      style={{
                        cursor: "pointer",
                      }}
                    >

                      <div className="task-icon">
                        {task.icon}
                      </div>


                      <div className="task-main">

                        <h3>
                          {task.title}
                        </h3>

                        <p>
                          <MapPin size={12} />
                          {task.location}
                        </p>

                      </div>


                      <span
                        className={`task-status ${task.statusClass}`}
                      >
                        {task.status}
                      </span>


                      <ArrowRight
                        className="task-arrow"
                        size={17}
                      />

                    </motion.div>

                  ))}

                </div>

              </section>

            </div>

          </main>

        </div>


        {/* =====================================================
            BOTTOM NAV
        ===================================================== */}

        <BottomNav />

      </div>

    </PageTransition>
  );
}


export default Dashboard;