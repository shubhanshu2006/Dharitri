"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

export function AnimatedCounter({
  value,
  suffix = "",
  duration = 1.6,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    Math.round(latest).toLocaleString("en-IN")
  );

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration,
        ease: [0.16, 1, 0.3, 1],
      });
      return () => controls.stop();
    }
  }, [isInView, motionValue, value, duration]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
