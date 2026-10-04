import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import Sidebar from "./Sidebar";
import { getComplaints, STATUS_LIST } from "../data/complaints";
import "./Complaints.css";

function Complaints() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const complaints = useMemo(() => getComplaints(), []);

  const counts = useMemo(() => {
    const byStatus = Object.fromEntries(
      STATUS_LIST.map((status) => [
        status,
        complaints.filter((complaint) => complaint.status === status).length,
      ])
    );

    return {
      total: complaints.length,
      new: byStatus.New,
      active: byStatus.Pending + byStatus["In Progress"],
      resolved: byStatus.Completed,
      byStatus,
    };
  }, [complaints]);

  const visible =
    filter === "All"
      ? complaints
      : complaints.filter((complaint) => complaint.status === filter);

  const statusClass = (status) =>
    `complaint-status status-${status.toLowerCase().replace(" ", "-")}`;

  return (
    <div className="complaints-page">
      <Sidebar />

      <main className="complaints-main">
        <header className="complaints-header">
          <p>COMPLAINT MANAGEMENT</p>
          <h1>Complaints</h1>
          <span>Review complaints submitted by citizens and assign the right worker.</span>
        </header>

        <section className="complaints-summary">
          <div className="complaints-summary-card">
            <strong>{counts.total}</strong>
            <span>Total Complaints</span>
          </div>

          <div className="complaints-summary-card">
            <strong>{counts.new}</strong>
            <span>New Complaints</span>
          </div>

          <div className="complaints-summary-card">
            <strong>{counts.active}</strong>
            <span>In Progress</span>
          </div>

          <div className="complaints-summary-card">
            <strong>{counts.resolved}</strong>
            <span>Resolved</span>
          </div>
        </section>

        <section className="complaints-section">
          <div className="complaints-section-heading">
            <p>ALL COMPLAINTS</p>
            <h2>Citizen Complaints</h2>
          </div>

          <div className="complaints-filters" role="tablist" aria-label="Filter complaints">
            {["All", ...STATUS_LIST].map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={filter === item}
                className={`complaints-filter${filter === item ? " active" : ""}`}
                onClick={() => setFilter(item)}
              >
                {item}
                <span>{item === "All" ? counts.total : counts.byStatus[item]}</span>
              </button>
            ))}
          </div>

          <div className="complaints-grid">
            {visible.map((complaint) => (
              <article className="complaint-card" key={complaint.id}>
                <div className="complaint-image">
                  <img src={complaint.image} alt={complaint.title} />

                  <span className={`complaint-priority ${complaint.priority.toLowerCase()}`}>
                    {complaint.priority} Priority
                  </span>
                </div>

                <div className="complaint-content">
                  <div className="complaint-top">
                    <span className="complaint-id">{complaint.id}</span>
                    <span className={statusClass(complaint.status)}>{complaint.status}</span>
                  </div>

                  <h3>{complaint.title}</h3>

                  <p className="complaint-location">
                    <MapPin size={14} />
                    {complaint.category} · {complaint.ward}
                  </p>

                  <p className="complaint-description">{complaint.description}</p>

                  <button
                    type="button"
                    className="complaint-view-button"
                    onClick={() => navigate(`/complaints/${complaint.id}`)}
                  >
                    View Complaint
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {visible.length === 0 && (
            <p className="complaints-empty">No complaints with this status.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Complaints;
