import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";

/*
  CivicConnect entry point.

  The landing page and each portal (citizen / authority / worker) are separate
  apps that share one build. The first URL segment decides which one loads, and
  each is code-split so a visitor only downloads (and only gets the styles of)
  the app they actually open. Moving between them is a full page navigation,
  which keeps every portal's global CSS fully isolated from the others.
*/
const PORTALS = {
  citizen: lazy(() => import("./modules/citizen/CitizenApp.jsx")),
  authority: lazy(() => import("./modules/authority/AuthorityApp.jsx")),
  worker: lazy(() => import("./modules/worker/WorkerApp.jsx")),
};

const Landing = lazy(() => import("./landing/LandingApp.jsx"));

const segment = window.location.pathname.split("/").filter(Boolean)[0];
const Portal = PORTALS[segment] ?? Landing;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Portal />
    </Suspense>
  </StrictMode>
);
