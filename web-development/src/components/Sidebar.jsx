import { NavLink, useNavigate } from "react-router-dom";

import {
  Home,
  ClipboardList,
  Clock3,
  UserRound,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import "../styles/sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  // Sidebar open / collapsed state
  const [collapsed, setCollapsed] = useState(false);

  // Logout popup state
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  /* =========================================
     CONNECT SIDEBAR STATE TO MAIN CONTENT
  ========================================= */

  useEffect(() => {
    document.body.classList.toggle(
      "sidebar-is-collapsed",
      collapsed
    );

    return () => {
      document.body.classList.remove(
        "sidebar-is-collapsed"
      );
    };
  }, [collapsed]);

  /* =========================================
     LOGOUT BUTTON
  ========================================= */

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  /* =========================================
     CONFIRM LOGOUT
  ========================================= */

  const confirmLogout = () => {
    localStorage.removeItem("workerLoggedIn");
    sessionStorage.removeItem("workerLoggedIn");

    navigate("/");
  };

  /* =========================================
     NAVIGATION LINKS
  ========================================= */

  const links = [
    {
      name: "Home",
      path: "/dashboard",
      icon: Home,
    },
    {
      name: "Tasks",
      path: "/assigned-tasks",
      icon: ClipboardList,
    },
    {
      name: "History",
      path: "/history",
      icon: Clock3,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: UserRound,
    },
  ];

  return (
    <>
      <aside
        className={`desktop-sidebar ${
          collapsed ? "sidebar-collapsed" : ""
        }`}
      >

        {/* =====================================
            LOGO
        ===================================== */}

        <div className="sidebar-logo">
          <img
            src="/images/logo.png"
            alt="CivicConnect Logo"
            className="sidebar-logo-image"
          />
        </div>


        {/* =====================================
            COLLAPSE / OPEN BUTTON
        ===================================== */}

        <button
          type="button"
          className="sidebar-collapse-button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={
            collapsed
              ? "Open sidebar"
              : "Close sidebar"
          }
        >
          {collapsed ? (
            <ChevronRight size={19} />
          ) : (
            <ChevronLeft size={19} />
          )}
        </button>


        {/* =====================================
            NAVIGATION
        ===================================== */}

        <nav className="sidebar-navigation">

          {!collapsed && (
            <p className="sidebar-label">
              MAIN MENU
            </p>
          )}

          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                title={collapsed ? link.name : ""}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >

                <Icon size={20} />

                {!collapsed && (
                  <span>
                    {link.name}
                  </span>
                )}

              </NavLink>
            );
          })}

        </nav>


        {/* =====================================
            SIDEBAR BOTTOM
        ===================================== */}

        <div className="sidebar-bottom">

          {/* WORKER STATUS */}

          {!collapsed && (
            <div className="sidebar-worker">

              <div className="sidebar-worker-avatar">
                W
              </div>

              <div>
                <strong>
                  Worker
                </strong>

                <span>
                  Active
                </span>
              </div>

              <span className="sidebar-online"></span>

            </div>
          )}


          {/* LOGOUT */}

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
            title={collapsed ? "Logout" : ""}
          >

            <LogOut size={18} />

            {!collapsed && (
              <span>
                Logout
              </span>
            )}

          </button>

        </div>

      </aside>


      {/* =================================================
          LOGOUT POPUP
      ================================================= */}

      {showLogoutPopup && (
        <div
          className="sidebar-popup-overlay"
          onClick={() => setShowLogoutPopup(false)}
        >

          <div
            className="sidebar-popup"
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE BUTTON */}

            <button
              type="button"
              className="sidebar-popup-close"
              onClick={() => setShowLogoutPopup(false)}
              aria-label="Close logout popup"
            >
              <X size={18} />
            </button>


            {/* LOGOUT ICON */}

            <div className="sidebar-popup-icon">
              <LogOut size={24} />
            </div>


            {/* TITLE */}

            <h3>
              Logout?
            </h3>


            {/* MESSAGE */}

            <p>
              Are you sure you want to logout from
              your CivicConnect worker account?
            </p>


            {/* BUTTONS */}

            <div className="sidebar-popup-actions">

              <button
                type="button"
                className="sidebar-popup-cancel"
                onClick={() => setShowLogoutPopup(false)}
              >
                Cancel
              </button>


              <button
                type="button"
                className="sidebar-popup-confirm"
                onClick={confirmLogout}
              >
                <LogOut size={16} />

                Logout
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default Sidebar;