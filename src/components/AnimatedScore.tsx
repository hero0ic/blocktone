"use client";

import { useEffect, useState } from "react";

interface AnimatedScoreProps {
  value: number;
  duration?: number;
  className?: string;
}

export default function AnimatedScore({
  value,
  duration = 1200,
  className = "",
}: AnimatedScoreProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <span className={className}>{display}</span>;
}
