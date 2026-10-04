import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useCallback, useRef } from "react";

import "./styles/variables.css";
import "./styles/global.css";
import "./styles/animations.css";
import "./styles/responsive.css";
import "./styles/toast.css";

import AuthPage from "../../shared/AuthPage.jsx";
import WelcomeIntro from "../../shared/WelcomeIntro.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./context/ProtectedRoute";

import Dashboard from "./pages/Dashboard/Dashboard";
import ReportIssue from "./pages/ReportIssue/ReportIssue";
import Complaints from "./pages/Complaints/Complaints";
import TrackStatus from "./pages/TrackStatus/TrackStatus";
import Alerts from "./pages/Alerts/Alerts";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound/NotFound";

function CitizenAuth() {
  const navigate = useNavigate();
  const { user, isReady, login, register } = useAuth();
  const submitting = useRef(false);

  // A returning citizen with an active session goes straight to the dashboard
  // (but not mid-login, where the welcome screen comes first).
  if (isReady && user && !submitting.current) return <Navigate to="/dashboard" replace />;

  const adapter = {
    login: async ({ identifier, password }) => {
      submitting.current = true;
      try {
        await login({ identifier: identifier.trim(), password });
        return { ok: true };
      } catch (e) {
        submitting.current = false;
        return { ok: false, error: e.message };
      }
    },
    signup: async ({ name, mobile, email, password }) => {
      submitting.current = true;
      try {
        await register({ name, mobile, email, password });
        return { ok: true };
      } catch (e) {
        submitting.current = false;
        return { ok: false, error: e.message };
      }
    },
    forgot: async () => ({
      ok: true,
      message:
        "If that account exists, we've sent reset instructions to your registered contact.",
    }),
  };

  return (
    <AuthPage role="citizen" adapter={adapter} onAuthenticated={() => navigate("/welcome")} />
  );
}

function CitizenWelcome() {
  const navigate = useNavigate();
  const { user, isReady } = useAuth();
  const done = useCallback(() => navigate("/dashboard", { replace: true }), [navigate]);

  if (isReady && !user) return <Navigate to="/" replace />;
  return <WelcomeIntro role="citizen" onDone={done} />;
}

/** Citizen portal — served under /citizen. */
export default function CitizenApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter basename="/citizen">
          <Routes>
            <Route path="/" element={<CitizenAuth />} />
            <Route path="/welcome" element={<CitizenWelcome />} />

            {/* Old auth URLs now live inside the shared auth page. */}
            <Route path="/auth" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
            <Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
            <Route path="/track/:id" element={<ProtectedRoute><TrackStatus /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
