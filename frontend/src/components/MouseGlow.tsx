"use client";

import { useEffect } from "react";

export default function MouseGlow() {
  useEffect(() => {
    const updateGlow = (event: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
    };

    window.addEventListener("mousemove", updateGlow);
    return () => window.removeEventListener("mousemove", updateGlow);
  }, []);

  return <div aria-hidden className="pointer-events-none fixed inset-0 z-10 mouse-glow" />;
}
