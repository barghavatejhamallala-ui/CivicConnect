import civicLogo from "../assets/civic-logo.jpeg";
import { Check } from "lucide-react";

function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">

      {/* LEFT SIDE - LOGO */}

      <div className="how-left reveal-on-scroll">

        <div className="how-logo">

          <div className="how-logo-ring"></div>

          <img
            src={civicLogo}
            alt="CivicConnect Logo"
          />

        </div>

      </div>


      {/* RIGHT SIDE - CONTENT */}

      <div className="how-content reveal-on-scroll">

        <div className="how-tag-pill">
          HOW IT WORKS
        </div>

        <h2>
          Connecting People.
          <br />
          <span>Improving Communities.</span>
        </h2>

        <p>
          CivicConnect is a digital platform designed to connect citizens,
          authorities and workers in one place.
        </p>

        <p>
          Citizens can report civic problems, authorities can manage the
          reported issues, and workers can take action to resolve them.
        </p>

        <div className="how-points">

          <div className="how-point">
            <span className="check"><Check size={15} strokeWidth={2.6} aria-hidden="true" /></span>
            <span>Simple and easy communication</span>
          </div>

          <div className="how-point">
            <span className="check"><Check size={15} strokeWidth={2.6} aria-hidden="true" /></span>
            <span>Better coordination between users</span>
          </div>

          <div className="how-point">
            <span className="check"><Check size={15} strokeWidth={2.6} aria-hidden="true" /></span>
            <span>Faster civic issue resolution</span>
          </div>

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;