import civicLogo from "../assets/civic-logo.jpeg";
import { FileEdit, Search, CheckCircle2, MapPin, ArrowRight } from "lucide-react";

function Hero() {
  return (
    <section className="hero" id="home">

      {/* LEFT SIDE */}
      <div className="hero-content">

        <div className="hero-badge">
          <span className="badge-dot"></span>
          CIVIC ENGAGEMENT PLATFORM
        </div>

        <h1>
          Report.
          <br />
          Track.
          <br />
          <span>Resolved.</span>
        </h1>

        <p>
          CivicConnect is a smart platform that helps citizens report civic
          issues, track progress in real-time, and ensure faster resolutions.
        </p>

        <div className="hero-buttons">

          <a href="#get-started" className="gold-btn">
            Get Started
           
          </a>

          <button className="primary-btn">
            <FileEdit size={18} strokeWidth={2.2} />
            Report an Issue
          </button>

          <button className="secondary-btn">
            <Search size={18} strokeWidth={2.2} />
            Track Complaint
          </button>

        </div>

      </div>


      {/* RIGHT SIDE — LANDING INTRO VISUAL */}
      <div className="hero-visual">

        <div className="hero-panel">

          {/* YOUR PROJECT LOGO */}
          <div className="hero-project-logo">

            <div className="logo-ring"></div>

            <img
              src={civicLogo}
              alt="CivicConnect Logo"
            />

          </div>

          {/* Complaint information card */}
          <div className="complaint-card">

            <div className="complaint-title">
              <CheckCircle2 size={16} strokeWidth={2.4} />
              Complaint Submitted
            </div>

            <div className="complaint-location">
              <MapPin size={13} strokeWidth={2.4} />
              Pothole on Main Street
            </div>

            <div className="tracking-id">
              Tracking ID: CC-2024-00125
            </div>

          </div>

          {/* Floating location badge */}
          <div className="location-pin">
            <MapPin size={20} strokeWidth={2.2} />
          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;
