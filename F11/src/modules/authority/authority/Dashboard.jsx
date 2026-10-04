import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Clock, UserCheck, CircleCheck, Bell } from "lucide-react";
import Sidebar from "./Sidebar";
import RoleHero from "../../../shared/RoleHero";
import { PageContainer, PageHead, StatGrid, StatCard } from "../../../shared/PortalPage";
import Icon from "../components/Icons";
import useNotifications from "../../../shared/useNotifications.js";
import { getComplaints } from "../data/complaints";
import { AUTHORITY_READ_KEY, buildAuthorityNotifications } from "../data/notifications";
import "./Dashboard.css";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 17) {
    return "Good Afternoon";
  }

  return "Good Evening";
}

function Dashboard() {
  const navigate = useNavigate();

  /* Bell dropdown: the latest few, from the same list as the Notifications page. */
  const { items, markRead, markAllRead } = useNotifications(
    AUTHORITY_READ_KEY,
    buildAuthorityNotifications
  );
  const notifications = useMemo(
    () =>
      items.slice(0, 8).map((n) => ({
        ...n,
        icon: n.icon || Bell,
        onOpen: () => navigate(n.to),
      })),
    [items, navigate]
  );

  /* Live data from the shared complaint store */
  const complaints = useMemo(
    () =>
      getComplaints().map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        location: c.ward,
        status: c.status,
        progress: c.progress,
      })),
    []
  );

  const [greeting, setGreeting] = useState(getGreeting());
  const [authorityName, setAuthorityName] = useState(() => {
    return localStorage.getItem("civicAuthorityName")?.trim() || "Authority";
  });

  useEffect(() => {
    const savedName = localStorage.getItem("civicAuthorityName")?.trim();
    setAuthorityName(savedName || "Authority");
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    const newCount = complaints.filter(
      (c) => c.status === "New"
    ).length;

    const pending = complaints.filter(
      (c) => c.status === "Pending"
    ).length;

    const inProgress = complaints.filter(
      (c) => c.status === "In Progress"
    ).length;

    const completed = complaints.filter(
      (c) => c.status === "Completed"
    ).length;

    const total = complaints.length;

    const progress = Math.round(
      (completed / total) * 100
    );

    return {
      newCount,
      pending,
      inProgress,
      completed,
      total,
      progress,
    };
  }, [complaints]);

  const ringOffset =
    289 - (289 * stats.progress) / 100;

  const nextComplaint = complaints.find(
    (c) => c.status === "New"
  );

  const statCards = [
    { label: "New Complaints", value: stats.newCount, icon: ClipboardList, tone: "blue" },
    { label: "Pending Complaints", value: stats.pending, icon: Clock, tone: "gold" },
    { label: "In Progress", value: stats.inProgress, icon: UserCheck, tone: "purple" },
    { label: "Completed", value: stats.completed, icon: CircleCheck, tone: "green" },
  ];

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <main className="cc-main fade-in-stack">
        <PageContainer>

        <PageHead
          eyebrow="AUTHORITY DASHBOARD"
          title={`${greeting}, ${authorityName}`}
          subtitle="Here’s what’s happening across your jurisdiction today."
          notifications={notifications}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
          onViewAll={() => navigate("/notifications")}
        />

        <RoleHero
          className="authority-hero"
          badge="Authority Module"
          highlight="Authority!"
          text="Review incoming civic issues, assign the right worker and track every complaint through to resolution."
          ctaLabel="View Complaints"
          onCta={() => navigate("/complaints")}
          image="/hero/authority-hero.png"
          imageAlt="CivicConnect authority officer holding a tablet"
        />


        <StatGrid>
          {statCards.map((card) => (
            <StatCard
              key={card.label}
              icon={card.icon}
              label={card.label}
              value={card.value}
              tone={card.tone}
            />
          ))}
        </StatGrid>

        {/* =====================================================
            PERFORMANCE + NEEDS ATTENTION
        ===================================================== */}

        <section className="dashboard-grid">

          {/* RESOLUTION PROGRESS */}

          <div className="progress-card">

            <div className="card-heading">

              <div>

                <p className="mini-label">
                  PERFORMANCE
                </p>

                <h3>
                  Resolution Progress
                </h3>

                <p>
                  Overall complaint completion rate
                </p>

              </div>


              <Icon
                name="chart"
                size={20}
              />

            </div>


            <div className="progress-content">

              <div className="progress-ring">

                <svg
                  viewBox="0 0 100 100"
                  aria-hidden="true"
                >

                  <circle
                    className="progress-track"
                    cx="50"
                    cy="50"
                    r="46"
                  />

                  <circle
                    className="progress-value"
                    cx="50"
                    cy="50"
                    r="46"
                  />

                </svg>


                <span className="progress-number">
                  {stats.progress}%
                </span>

              </div>


              <div className="progress-text">

                <strong>
                  {stats.completed} of {stats.total} complaints
                </strong>

                <p>
                  resolved overall
                </p>

                <span>
                  {stats.pending +
                    stats.inProgress +
                    stats.newCount}{" "}
                  complaints still open
                </span>

              </div>

            </div>

          </div>


          {/* NEEDS ATTENTION */}

          <div className="quick-card">

            <div className="quick-icon">

              <Icon
                name="alert"
                size={22}
              />

            </div>


            <div className="quick-body">

              <p className="quick-label">
                NEEDS ATTENTION
              </p>

              <h3>
                {nextComplaint?.title ||
                  "All caught up"}
              </h3>

              <p className="quick-location">

                <Icon
                  name="mapPin"
                  size={13}
                />

                {nextComplaint?.location ||
                  "Every complaint has a worker."}

              </p>

            </div>


            <button
              type="button"
              className="quick-arrow"
              onClick={() =>
                navigate(
                  nextComplaint
                    ? `/complaints/${nextComplaint.id}`
                    : "/complaints"
                )
              }
              aria-label="View complaints"
            >

              <Icon
                name="arrowRight"
                size={18}
              />

            </button>

          </div>

        </section>


        {/* =====================================================
            RECENT ACTIVITY
        ===================================================== */}

        <section className="recent-section">

          <div className="section-heading">

            <div>

              <p>
                RECENT ACTIVITY
              </p>

              <h2>
                Latest Complaints
              </h2>

            </div>


            <button
              type="button"
              className="view-all"
              onClick={() =>
                navigate("/complaints")
              }
            >

              View all

              <Icon
                name="arrowRight"
                size={15}
              />

            </button>

          </div>


          <div className="recent-list">

            {complaints.slice(0, 4).map((complaint) => (

              <button
                key={complaint.id}
                type="button"
                className="recent-task"
                onClick={() =>
                  navigate(`/complaints/${complaint.id}`)
                }
              >

                <div className="task-icon">

                  <Icon
                    name={
                      complaint.category === "Road"
                        ? "tracking"
                        : complaint.category ===
                          "Electricity"
                        ? "chart"
                        : complaint.category ===
                          "Water"
                        ? "pending"
                        : "complaints"
                    }
                    size={19}
                  />

                </div>


                <div className="task-main">

                  <span>
                    {complaint.id}
                  </span>

                  <h3>
                    {complaint.title}
                  </h3>

                  <p>

                    <Icon
                      name="mapPin"
                      size={13}
                    />

                    {complaint.location}

                  </p>

                </div>


                <div className="task-progress">

                  <span>
                    {complaint.progress}%
                  </span>

                  <div>

                    <i
                      style={{
                        width: `${complaint.progress}%`,
                      }}
                    />

                  </div>

                </div>


                <span
                  className={`task-status-pill status-${complaint.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >

                  {complaint.status}

                </span>


                <Icon
                  name="arrowRight"
                  className="task-arrow"
                  size={17}
                />

              </button>

            ))}

          </div>

        </section>


        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <section className="quick-actions-section">

          <div className="section-heading">

            <div>

              <p>
                QUICK ACTIONS
              </p>

              <h2>
                Manage Services
              </h2>

            </div>

          </div>


          <div className="quick-actions-grid">

            {/* VIEW COMPLAINTS */}

            <button
              type="button"
              className="quick-action-card"
              onClick={() =>
                navigate("/complaints")
              }
            >

              <span className="quick-action-icon">

                <Icon
                  name="complaints"
                  size={22}
                />

              </span>


              <span className="quick-action-text">

                <strong>
                  View Complaints
                </strong>

                <small>
                  Review citizen complaints
                </small>

              </span>


              <Icon
                name="arrowRight"
                size={20}
              />

            </button>


            {/* ASSIGN WORKER */}

            <button
              type="button"
              className="quick-action-card"
              onClick={() =>
                navigate(
                  nextComplaint
                    ? `/complaints/${nextComplaint.id}`
                    : "/complaints"
                )
              }
            >

              <span className="quick-action-icon">

                <Icon
                  name="worker"
                  size={22}
                />

              </span>


              <span className="quick-action-text">

                <strong>
                  Assign Worker
                </strong>

                <small>
                  Dispatch complaints quickly
                </small>

              </span>


              <Icon
                name="arrowRight"
                size={20}
              />

            </button>


            {/* TRACK COMPLAINTS */}

            <button
              type="button"
              className="quick-action-card"
              onClick={() =>
                navigate("/tracking")
              }
            >

              <span className="quick-action-icon">

                <Icon
                  name="tracking"
                  size={22}
                />

              </span>


              <span className="quick-action-text">

                <strong>
                  Track Complaints
                </strong>

                <small>
                  Monitor live progress
                </small>

              </span>


              <Icon
                name="arrowRight"
                size={20}
              />

            </button>

          </div>

        </section>

        </PageContainer>
      </main>

    </div>
  );
}

export default Dashboard;