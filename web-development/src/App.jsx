import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import AssignedTasks from "./pages/AssignedTasks";
import TaskDetails from "./pages/TaskDetails";
import History from "./pages/History";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =====================================================
            LOGIN PAGE
            ===================================================== */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/worker/login"
          element={<Login />}
        />


        {/* =====================================================
            WELCOME PAGE
            ===================================================== */}

        <Route
          path="/welcome"
          element={<Welcome />}
        />


        {/* =====================================================
            DASHBOARD
            ===================================================== */}

        {/* Existing route */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Worker route used by Login */}
        <Route
          path="/worker/dashboard"
          element={<Dashboard />}
        />


        {/* =====================================================
            ASSIGNED TASKS
            ===================================================== */}

        {/* Existing route */}
        <Route
          path="/assigned-tasks"
          element={<AssignedTasks />}
        />

        {/* Worker route */}
        <Route
          path="/worker/assigned-tasks"
          element={<AssignedTasks />}
        />


        {/* =====================================================
            TASK DETAILS
            ===================================================== */}

        {/* Existing route */}
        <Route
          path="/task-details"
          element={<TaskDetails />}
        />

        {/* Worker route */}
        <Route
          path="/worker/task-details"
          element={<TaskDetails />}
        />


        {/* =====================================================
            HISTORY
            ===================================================== */}

        {/* Existing route */}
        <Route
          path="/history"
          element={<History />}
        />

        {/* Worker route */}
        <Route
          path="/worker/history"
          element={<History />}
        />


        {/* =====================================================
            PROFILE
            ===================================================== */}

        {/* Existing route */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* Worker route */}
        <Route
          path="/worker/profile"
          element={<Profile />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;