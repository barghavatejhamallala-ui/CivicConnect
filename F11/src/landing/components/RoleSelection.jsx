import { ArrowRight } from 'lucide-react';
import { roles } from '../data/roles';

function RoleSelection() {
  return (
    <section className="roles-section" id="roles">

      <div className="section-heading">
        <span>ROLES</span>
        <h2>Choose Your Role</h2>
        <div className="heading-line"></div>
      </div>

      <div className="role-grid">

        {roles.map((role) => (
          <div key={role.id} className="role-card role-card-plain reveal-on-scroll">

            <div className="role-content">
              <div className="role-icon">
                <role.Icon size={22} strokeWidth={2.2} />
              </div>
              <div className="role-info">
                <h3>{role.title}</h3>
              </div>
            </div>

            <p className="role-description">
              {role.description}
            </p>

          </div>
        ))}

      </div>

      <a href="#get-started" className="gold-btn roles-cta">
        Get Started
            </a>

    </section>
  );
}

export default RoleSelection;
