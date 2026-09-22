
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  MapPin,
  CheckCircle2,
  LogOut,
  Trash2,
  X,
  AlertTriangle,
  LockKeyhole,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import PageTransition from "../components/PageTransition";

import "../styles/profile.css";

function Profile() {
  const navigate = useNavigate();

  /* =========================================
     WORKER DETAILS
  ========================================= */

  const [worker, setWorker] = useState({
    name: "CivicConnect Worker",
    username: "worker",
    email: "worker@civicconnect.com",
    phone: "+91 98765 43210",
    area: "Visakhapatnam",
    workerId: "CW-1025",
    department: "Municipal Services",
  });

  /* =========================================
     WORKER PASSWORD
  ========================================= */

  const [workerPassword, setWorkerPassword] =
    useState("worker@1234");

  /* =========================================
     SUMMARY CARD VALUES
  ========================================= */

  const [assignedCount, setAssignedCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  /* =========================================
     POPUP STATES
  ========================================= */

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  /* =========================================
     CHANGE PASSWORD STATES
  ========================================= */

  const [showChangePassword, setShowChangePassword] =
    useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  /* =========================================
     LOAD WORKER DETAILS
  ========================================= */

  useEffect(() => {
    const savedWorker = localStorage.getItem("workerAccount");

    if (savedWorker) {
      try {
        const workerData = JSON.parse(savedWorker);

        setWorker((previousWorker) => ({
          ...previousWorker,
          ...workerData,
        }));
      } catch (error) {
        console.error(
          "Unable to load worker profile:",
          error
        );
      }
    }

    /* -----------------------------------------
       Load saved worker password
       ----------------------------------------- */

    const savedPassword =
      localStorage.getItem("workerPassword");

    if (savedPassword) {
      setWorkerPassword(savedPassword);
    }
  }, []);

  /* =========================================
     SUMMARY ANIMATIONS
  ========================================= */

  useEffect(() => {
    /* -----------------------------------------
       Assigned tasks: 0 -> 3
       ----------------------------------------- */

    let assigned = 0;

    const assignedTimer = setInterval(() => {
      assigned += 1;

      if (assigned >= 3) {
        assigned = 3;
        clearInterval(assignedTimer);
      }

      setAssignedCount(assigned);
    }, 180);

    /* -----------------------------------------
       Completed tasks: 0 -> 3
       ----------------------------------------- */

    let completed = 0;

    const completedTimer = setInterval(() => {
      completed += 1;

      if (completed >= 3) {
        completed = 3;
        clearInterval(completedTimer);
      }

      setCompletedCount(completed);
    }, 220);

    /* -----------------------------------------
       Completion rate: 0 -> 100
       ----------------------------------------- */

    let percentage = 0;

    const percentageTimer = setInterval(() => {
      percentage += 5;

      if (percentage >= 100) {
        percentage = 100;
        clearInterval(percentageTimer);
      }

      setCompletionRate(percentage);
    }, 25);

    /* -----------------------------------------
       CLEANUP
       ----------------------------------------- */

    return () => {
      clearInterval(assignedTimer);
      clearInterval(completedTimer);
      clearInterval(percentageTimer);
    };
  }, []);

  /* =========================================
     OPEN CHANGE PASSWORD
  ========================================= */

  const handleOpenChangePassword = () => {
    setShowChangePassword(true);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordError("");
    setPasswordSuccess("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  /* =========================================
     CLOSE CHANGE PASSWORD
  ========================================= */

  const handleCloseChangePassword = () => {
    setShowChangePassword(false);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordError("");
    setPasswordSuccess("");

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  /* =========================================
     CHANGE PASSWORD
  ========================================= */

  const handleChangePassword = (e) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    /* -----------------------------------------
       Check current password
       ----------------------------------------- */

    if (!currentPassword) {
      setPasswordError(
        "Please enter your current password."
      );
      return;
    }

    if (currentPassword !== workerPassword) {
      setPasswordError(
        "Current password is incorrect."
      );
      return;
    }

    /* -----------------------------------------
       Check new password
       ----------------------------------------- */

    if (!newPassword) {
      setPasswordError(
        "Please enter a new password."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    /* -----------------------------------------
       Check confirm password
       ----------------------------------------- */

    if (!confirmPassword) {
      setPasswordError(
        "Please confirm your new password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New passwords do not match."
      );
      return;
    }

    /* -----------------------------------------
       Prevent same password
       ----------------------------------------- */

    if (newPassword === currentPassword) {
      setPasswordError(
        "New password must be different from your current password."
      );
      return;
    }

    /* -----------------------------------------
       Save new password
       ----------------------------------------- */

    localStorage.setItem(
      "workerPassword",
      newPassword
    );

    setWorkerPassword(newPassword);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordSuccess(
      "Password changed successfully."
    );
  };

  /* =========================================
     LOGOUT
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
     DELETE ACCOUNT
  ========================================= */

  const handleDeleteAccount = () => {
    setShowDeletePopup(true);
  };

  /* =========================================
     CONFIRM DELETE ACCOUNT
  ========================================= */

  const confirmDeleteAccount = () => {
    localStorage.removeItem("workerAccount");
    localStorage.removeItem("workerPassword");

    localStorage.removeItem("workerLoggedIn");
    localStorage.removeItem("rememberWorker");

    sessionStorage.removeItem("workerLoggedIn");

    navigate("/");
  };

  return (
    <PageTransition>
      <Sidebar />

      <div className="app-shell">
        <main className="page-content profile-page">

          {/* =========================================
              HEADER
          ========================================= */}

          <div className="profile-header">
            <h1>
              My Profile
            </h1>

            <p>
              Worker information and work summary.
            </p>
          </div>

          {/* =========================================
              MAIN PROFILE CARD
          ========================================= */}

          <section className="profile-main-card">

            {/* =====================================
                WORKER SECTION
            ===================================== */}

            <div className="profile-image-section">

              <div className="profile-worker-animation">
                <img
                  src="/worker-poses/thumbs-up-01.png"
                  alt="Municipal Worker"
                  className="profile-worker-image"
                />
              </div>

              <h2>
                {worker.name}
              </h2>

              <span className="profile-role">
                Municipal Worker
              </span>

              <div className="profile-active-status">
                <CheckCircle2 size={15} />
                Active Worker
              </div>

              {/* =====================================
                  ACCOUNT ACTIONS
              ===================================== */}

              <div className="profile-account-actions">

                {/* CHANGE PASSWORD */}

                <button
                  type="button"
                  className="profile-change-password-button"
                  onClick={handleOpenChangePassword}
                >
                  <LockKeyhole size={17} />

                  <span>
                    Change Password
                  </span>
                </button>

                {/* LOGOUT */}

                <button
                  type="button"
                  className="profile-logout-button"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />

                  <span>
                    Log out
                  </span>
                </button>

                {/* DELETE ACCOUNT */}

                <button
                  type="button"
                  className="profile-delete-button"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 size={17} />

                  <span>
                    Delete Account
                  </span>
                </button>

              </div>
            </div>

            {/* =====================================
                WORKER INFORMATION
            ===================================== */}

            <div className="profile-information">

              <h3>
                Worker Information
              </h3>

              {/* NAME */}

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <User size={19} />
                </div>

                <div>
                  <span>
                    Full Name
                  </span>

                  <strong>
                    {worker.name}
                  </strong>
                </div>
              </div>

              {/* WORKER ID */}

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <Briefcase size={19} />
                </div>

                <div>
                  <span>
                    Worker ID
                  </span>

                  <strong>
                    {worker.workerId}
                  </strong>
                </div>
              </div>

              {/* DEPARTMENT */}

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <Building2 size={19} />
                </div>

                <div>
                  <span>
                    Department
                  </span>

                  <strong>
                    {worker.department}
                  </strong>
                </div>
              </div>

              {/* EMAIL */}

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <Mail size={19} />
                </div>

                <div>
                  <span>
                    Email
                  </span>

                  <strong>
                    {worker.email}
                  </strong>
                </div>
              </div>

              {/* PHONE */}

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <Phone size={19} />
                </div>

                <div>
                  <span>
                    Phone
                  </span>

                  <strong>
                    {worker.phone}
                  </strong>
                </div>
              </div>

              {/* LOCATION */}

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <MapPin size={19} />
                </div>

                <div>
                  <span>
                    Assigned Area
                  </span>

                  <strong>
                    {worker.area}
                  </strong>
                </div>
              </div>

            </div>
          </section>

          {/* =========================================
              WORK SUMMARY
          ========================================= */}

          <section className="profile-summary">

            {/* ASSIGNED TASKS */}

            <div className="profile-summary-card assigned-card">
              <strong>
                {assignedCount}
              </strong>

              <span>
                Assigned Tasks
              </span>
            </div>

            {/* COMPLETED TASKS */}

            <div className="profile-summary-card completed-card">
              <strong>
                {completedCount}
              </strong>

              <span>
                Completed Tasks
              </span>
            </div>

            {/* COMPLETION RATE */}

            <div className="profile-summary-card progress-card">
              <strong>
                {completionRate}%
              </strong>

              <span>
                Completion Rate
              </span>
            </div>

          </section>
        </main>

        {/* =========================================
            BOTTOM NAVIGATION
        ========================================= */}

        <BottomNav />

        {/* =================================================
            CHANGE PASSWORD POPUP
        ================================================= */}

        {showChangePassword && (
          <div
            className="profile-popup-overlay"
            onClick={handleCloseChangePassword}
          >
            <div
              className="profile-popup change-password-popup"
              onClick={(e) => e.stopPropagation()}
            >

              {/* CLOSE BUTTON */}

              <button
                type="button"
                className="profile-popup-close"
                onClick={handleCloseChangePassword}
                aria-label="Close change password popup"
              >
                <X size={18} />
              </button>

              {/* ICON */}

              <div className="profile-popup-icon password-popup-icon">
                <KeyRound size={24} />
              </div>

              <h3>
                Change Password
              </h3>

              <p>
                Update your worker account password securely.
              </p>

              {/* ERROR */}

              {passwordError && (
                <div className="profile-password-error">
                  <AlertTriangle size={16} />
                  {passwordError}
                </div>
              )}

              {/* SUCCESS */}

              {passwordSuccess && (
                <div className="profile-password-success">
                  <CheckCircle2 size={16} />
                  {passwordSuccess}
                </div>
              )}

              <form onSubmit={handleChangePassword}>

                {/* CURRENT PASSWORD */}

                <div className="profile-password-field">

                  <label>
                    Current Password
                  </label>

                  <div className="profile-password-input-wrapper">

                    <LockKeyhole size={17} />

                    <input
                      type={
                        showCurrentPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        setPasswordError("");
                        setPasswordSuccess("");
                      }}
                    />

                    <button
                      type="button"
                      className="profile-password-toggle"
                      onClick={() =>
                        setShowCurrentPassword(
                          !showCurrentPassword
                        )
                      }
                      aria-label={
                        showCurrentPassword
                          ? "Hide current password"
                          : "Show current password"
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>
                </div>

                {/* NEW PASSWORD */}

                <div className="profile-password-field">

                  <label>
                    New Password
                  </label>

                  <div className="profile-password-input-wrapper">

                    <LockKeyhole size={17} />

                    <input
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordError("");
                        setPasswordSuccess("");
                      }}
                    />

                    <button
                      type="button"
                      className="profile-password-toggle"
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword
                        )
                      }
                      aria-label={
                        showNewPassword
                          ? "Hide new password"
                          : "Show new password"
                      }
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>

                  <small>
                    Minimum 6 characters
                  </small>
                </div>

                {/* CONFIRM PASSWORD */}

                <div className="profile-password-field">

                  <label>
                    Confirm New Password
                  </label>

                  <div className="profile-password-input-wrapper">

                    <LockKeyhole size={17} />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(
                          e.target.value
                        );
                        setPasswordError("");
                        setPasswordSuccess("");
                      }}
                    />

                    <button
                      type="button"
                      className="profile-password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>
                </div>

                {/* BUTTONS */}

                <div className="profile-popup-actions">

                  <button
                    type="button"
                    className="profile-popup-cancel"
                    onClick={handleCloseChangePassword}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="profile-popup-confirm password-confirm"
                  >
                    <LockKeyhole size={16} />
                    Change Password
                  </button>

                </div>

              </form>

            </div>
          </div>
        )}

        {/* =================================================
            LOGOUT POPUP
        ================================================= */}

        {showLogoutPopup && (
          <div
            className="profile-popup-overlay"
            onClick={() => setShowLogoutPopup(false)}
          >
            <div
              className="profile-popup"
              onClick={(e) => e.stopPropagation()}
            >

              <button
                type="button"
                className="profile-popup-close"
                onClick={() => setShowLogoutPopup(false)}
                aria-label="Close logout popup"
              >
                <X size={18} />
              </button>

              <div className="profile-popup-icon logout-popup-icon">
                <LogOut size={24} />
              </div>

              <h3>
                Logout?
              </h3>

              <p>
                Are you sure you want to logout from
                your CivicConnect worker account?
              </p>

              <div className="profile-popup-actions">

                <button
                  type="button"
                  className="profile-popup-cancel"
                  onClick={() => setShowLogoutPopup(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="profile-popup-confirm logout-confirm"
                  onClick={confirmLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>

              </div>
            </div>
          </div>
        )}

        {/* =================================================
            DELETE ACCOUNT POPUP
        ================================================= */}

        {showDeletePopup && (
          <div
            className="profile-popup-overlay"
            onClick={() => setShowDeletePopup(false)}
          >
            <div
              className="profile-popup"
              onClick={(e) => e.stopPropagation()}
            >

              <button
                type="button"
                className="profile-popup-close"
                onClick={() => setShowDeletePopup(false)}
                aria-label="Close delete account popup"
              >
                <X size={18} />
              </button>

              <div className="profile-popup-icon delete-popup-icon">
                <AlertTriangle size={24} />
              </div>

              <h3>
                Delete Account?
              </h3>

              <p>
                Are you sure you want to delete your
                worker account? This action cannot be undone.
              </p>

              <div className="profile-popup-actions">

                <button
                  type="button"
                  className="profile-popup-cancel"
                  onClick={() => setShowDeletePopup(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="profile-popup-confirm delete-confirm"
                  onClick={confirmDeleteAccount}
                >
                  <Trash2 size={16} />
                  Delete Account
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
}

export default Profile;

