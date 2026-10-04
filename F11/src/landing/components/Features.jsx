import {
  MapPin,
  Bell,
  Handshake,
  Zap
} from "lucide-react";
function Features() {
  return (
    <section className="features" id="features">

      <div className="section-tag-pill">
        KEY FEATURES
      </div>

      <h2>
        Everything You Need to
        <br />
        <span>Improve Your Community</span>
      </h2>

      <p>
        A simple platform that helps citizens, authorities and workers
        communicate and solve civic issues efficiently.
      </p>

      <div className="features-container">

        {/* Feature 1 */}
        <div className="feature-card reveal-on-scroll">

          <div className="feature-icon">
            <MapPin size={22} strokeWidth={2.2} />
          </div>

          <h3>
            Easy Issue
            <br />
            Reporting
          </h3>

          <p>
            Citizens can quickly report problems happening in their
            streets or local areas.
          </p>

        </div>


        {/* Feature 2 */}
        <div className="feature-card reveal-on-scroll">

          <div className="feature-icon">
            <Bell size={22} strokeWidth={2.2} />
          </div>

          <h3>
            Real-Time Updates
          </h3>

          <p>
            Stay informed about the progress and status of reported
            civic issues.
          </p>

        </div>


        {/* Feature 3 */}
        <div className="feature-card reveal-on-scroll">

          <div className="feature-icon">
            <Handshake size={22} strokeWidth={2.2} />
          </div>

          <h3>
            Better Coordination
          </h3>

          <p>
            Authorities and workers can coordinate efficiently to solve
            reported problems.
          </p>

        </div>


        {/* Feature 4 */}
        <div className="feature-card reveal-on-scroll">

          <div className="feature-icon">
            <Zap size={22} strokeWidth={2.2} />
          </div>

          <h3>
            Faster Resolution
          </h3>

          <p>
            A connected system helps civic issues get resolved more
            effectively.
          </p>

        </div>

      </div>

    </section>
  );
}

export default Features;