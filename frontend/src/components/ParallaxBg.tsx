"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

type ParallaxBgProps = {
  children: React.ReactNode;
};

export default function ParallaxBg({ children }: ParallaxBgProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const translateX = useTransform(springX, [-0.5, 0.5], [18, -18]);
  const translateY = useTransform(springY, [-0.5, 0.5], [14, -14]);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      mouseX.set(event.clientX / window.innerWidth - 0.5);
      mouseY.set(event.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div style={{ x: translateX, y: translateY }} className="will-change-transform">
      {children}
    </motion.div>
  );
}
