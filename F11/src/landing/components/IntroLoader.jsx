import { useEffect, useState } from "react";
import civicLogo from "../assets/civic-logo.jpeg";

function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const leaveTimer = setTimeout(() => setLeaving(true), 1700);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 2200);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = "";
    };
  }, []);

  const dismiss = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 450);
  };

  if (!visible) return null;

  return (
    <div
      className={`intro-loader${leaving ? " intro-leaving" : ""}`}
      onClick={dismiss}
      role="button"
      aria-label="Skip intro"
    >
      <div className="intro-logo-ring">
        <img src={civicLogo} alt="CivicConnect" />
      </div>

      <div className="intro-title">
        Civic<span>Connect</span>
      </div>

      <div className="intro-tagline">Together for a Better City</div>

      <div className="intro-progress">
        <span></span>
      </div>

      <div className="intro-skip">Tap anywhere to skip</div>
    </div>
  );
}

export default IntroLoader;
