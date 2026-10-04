import { Handshake, Check } from "lucide-react";

function About() {
  return (
    <section className="about" id="about">

      {/* LEFT SIDE */}

      <div className="about-visual reveal-on-scroll">

        <div className="about-circle">

          <div className="about-icon">
            <Handshake size={108} strokeWidth={1.8} />
          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="about-content reveal-on-scroll">

        <p className="section-tag">
          ABOUT CIVICCONNECT
        </p>

        <h2>
          Connecting People.
          <span> Improving Communities.</span>
        </h2>

        <p className="about-description">
          CivicConnect is a digital platform designed to connect citizens,
          authorities and workers in one place.
        </p>

        <p className="about-description">
          Citizens can report civic problems, authorities can manage the
          reported issues, and workers can take action to resolve them.
        </p>


        <div className="about-points">

          <div className="about-point">
            <span><Check size={15} strokeWidth={2.6} aria-hidden="true" /></span>
            <p>Simple and easy communication</p>
          </div>

          <div className="about-point">
            <span><Check size={15} strokeWidth={2.6} aria-hidden="true" /></span>
            <p>Better coordination between users</p>
          </div>

          <div className="about-point">
            <span><Check size={15} strokeWidth={2.6} aria-hidden="true" /></span>
            <p>Faster civic issue resolution</p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default About;