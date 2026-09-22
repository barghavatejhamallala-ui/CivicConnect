import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Hand } from "lucide-react";

import PageTransition from "../components/PageTransition";

import "../styles/welcome.css";

function Welcome() {
  const navigate = useNavigate();

  const text = "Welcome, Worker!";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 4500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageTransition>
      <main className="welcome-page">

        <div className="welcome-glow welcome-glow-one"></div>

        <div className="welcome-glow welcome-glow-two"></div>

        <div className="welcome-card">

          <div className="welcome-badge">
            <span className="badge-dot"></span>
            Worker Portal
          </div>

          <h1 className="welcome-title">

            {text.split("").map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="jump-letter"
                style={{
                  animationDelay: `${index * 0.09}s`,
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}

            <span
              className="welcome-hand"
              style={{
                animationDelay: "1.65s",
              }}
            >
              <Hand size={34} strokeWidth={2} />
            </span>

          </h1>

          <p className="welcome-description">
            Ready to make a difference in your community?
          </p>

          <div className="welcome-line">
            <span></span>

            CivicConnect Worker Module

            <span></span>
          </div>

          <div className="welcome-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>

      </main>
    </PageTransition>
  );
}

export default Welcome;