"use client";

import { useEffect, useState } from "react";

interface TypewriterTextProps {
  text: string;
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
  speed?: number;
  startDelay?: number;
  showCursor?: boolean;
}

export default function TypewriterText({
  text,
  as: Tag = "p",
  className = "",
  speed = 22,
  startDelay = 120,
  showCursor = true,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let index = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return (
    <Tag className={className}>
      {displayed}
      {showCursor && (
        <span
          className={`typewriter-cursor ml-0.5 inline-block text-foreground ${
            done ? "typewriter-cursor-blink" : ""
          }`}
          aria-hidden
        >
          _
        </span>
      )}
    </Tag>
  );
}
