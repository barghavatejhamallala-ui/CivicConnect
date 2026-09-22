import { useEffect, useState } from "react";

const frames = [
  "/worker-poses/walk-01.png",
  "/worker-poses/walk-02.png",
  "/worker-poses/toolbox-01.png",
];

function WorkerReadyAnimation() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setFrame(1), 550),
      setTimeout(() => setFrame(2), 1100),
    ];

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="worker-ready-animation">
      <img
        src={frames[frame]}
        alt="CivicConnect worker getting ready for work"
        className="worker-ready-image"
      />

      <div className="worker-ready-glow"></div>
    </div>
  );
}

export default WorkerReadyAnimation;