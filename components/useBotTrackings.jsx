
import { useEffect, useRef, useState } from "react";

export default function useBotTracking() {
  const [clickCount, setClickCount] = useState(0);
  const mouseMovements = useRef([]);
  const keyIntervals = useRef({}); 
  const lastKeyTime = useRef({});
  const startTime = useRef(Date.now());

  useEffect(() => {
    const handleClick = () => setClickCount((prev) => prev + 1);

    const handleMouseMove = (e) => {
      const last = mouseMovements.current[mouseMovements.current.length - 1];
      if (!last || last.x !== e.clientX || last.y !== e.clientY) {
        mouseMovements.current.push({
          x: e.clientX,
          y: e.clientY,
          t: Date.now(),
        });
      }
    };

    const handleKeyDown = (e) => {
   
      const target = e.target;
      if (!target || !["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      const field = target.name || "global";
      const now = Date.now();

      if (!keyIntervals.current[field]) keyIntervals.current[field] = [];
      if (lastKeyTime.current[field]) {
        keyIntervals.current[field].push(now - lastKeyTime.current[field]);
      }
      lastKeyTime.current[field] = now;
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const getTrackingData = () => ({
    userAgent: navigator.userAgent,
    acceptLanguage: navigator.language || navigator.userLanguage || "unknown",
    mouseMovements: mouseMovements.current,
    clickCount,
    keystrokeIntervals: keyIntervals.current, // object with intervals per input field
    submissionTimeMs: Date.now() - startTime.current,
  });

  return getTrackingData;
}
