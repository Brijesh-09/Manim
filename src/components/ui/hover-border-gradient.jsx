"use client";;
import React, { useState, useEffect } from "react";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState("TOP");

  const rotateDirection = currentDirection => {
    const directions = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  // Use red gradients for border effect
  const movingMap = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, #f87171 0%, rgba(248,113,113,0) 100%)", // red-400
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, #f87171 0%, rgba(248,113,113,0) 100%)",
    BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, #f87171 0%, rgba(248,113,113,0) 100%)",
    RIGHT: "radial-gradient(16.2% 41.2% at 100% 50%, #f87171 0%, rgba(248,113,113,0) 100%)",
  };

  // Red highlight for hover
  const highlight =
    "radial-gradient(75% 181.15942028985506% at 50% 50%, #dc2626 0%, rgba(220,38,38,0) 100%)"; // red-600

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border border-gray-600 content-center bg-gray-600 hover:bg-gray-700 transition duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn("w-auto text-white z-10 bg-gray-600 px-2 py-2 rounded-[inherit]", className)}>
        {children}
      </div>
      <motion.div
        className={cn("flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]")}
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      {/* Remove the black overlay so the red background is visible */}
    </Tag>
  );
}
