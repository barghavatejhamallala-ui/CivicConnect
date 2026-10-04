import { ArrowRight } from "lucide-react";
import "./hero.css";

/*
  RoleHero — the welcome banner used on the Citizen and Authority home pages.
  It mirrors the Worker module's hero (same size, gradient, badge, heading,
  gold button and floating character) so all three modules look identical.
*/
function RoleHero({
  badge,
  highlight,
  text,
  ctaLabel,
  onCta,
  image,
  imageAlt,
  className = "",
}) {
  return (
    <div className={`cc-hero-wrap ${className}`.trim()}>
    <section className="cc-hero">
      <div className="cc-hero__content">
        <div className="cc-hero__badge">
          <span></span>
          {badge}
        </div>

        <h2>
          Welcome, <strong>{highlight}</strong>
        </h2>

        <p>{text}</p>

        <button type="button" className="cc-hero__button" onClick={onCta}>
          {ctaLabel}
          <ArrowRight size={17} />
        </button>
      </div>

      <div className="cc-hero__visual">
        <div className="cc-hero__stage">
          <div className="cc-hero__halo"></div>

          <img
            src={image}
            alt={imageAlt}
            className="cc-hero__figure"
            draggable={false}
            decoding="async"
          />

          <div className="cc-hero__glow"></div>
        </div>
      </div>
    </section>
    </div>
  );
}

export default RoleHero;
