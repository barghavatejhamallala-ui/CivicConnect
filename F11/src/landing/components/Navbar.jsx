import { useEffect, useState } from "react";
import civicLogo from "../assets/civic-logo.jpeg";

const SECTION_IDS = ["home", "features", "about", "roles", "how-it-works"];

function Navbar() {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="navbar">

      <a href="#home" className="navbar-brand">
        <img src={civicLogo} alt="CivicConnect Logo" />

        <span>
          Civic<span>Connect</span>
        </span>
      </a>

      <ul className="nav-links">

        <li>
          <a href="#home" className={activeId === "home" ? "active" : ""}>Home</a>
        </li>

        <li>
          <a href="#features" className={activeId === "features" ? "active" : ""}>Features</a>
        </li>

        <li>
          <a href="#about" className={activeId === "about" ? "active" : ""}>About Us</a>
        </li>

        <li>
          <a href="#roles" className={activeId === "roles" ? "active" : ""}>Roles</a>
        </li>

        <li>
          <a href="#how-it-works" className={activeId === "how-it-works" ? "active" : ""}>How It Works</a>
        </li>

      </ul>

      <a href="#get-started" className="nav-button">
        Get Started 
      </a>

    </nav>
  );
}

export default Navbar;
