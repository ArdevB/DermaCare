"use client";

import { motion } from "framer-motion";

const MOTION_TAGS = {
  div: motion.div,
  tbody: motion.tbody,
  tr: motion.tr,
  ul: motion.ul,
  li: motion.li,
};

export function FadeInSection({
  children,
  delay = 0,
  className = "",
  y = 24,
  as = "div",
}) {
  const Component = MOTION_TAGS[as] || motion.div;
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function StaggerGrid({ children, className = "", as = "div" }) {
  const Component = MOTION_TAGS[as] || motion.div;
  return (
    <Component
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ staggerChildren: 0.08 }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({ children, className = "", as = "div" }) {
  const Component = MOTION_TAGS[as] || motion.div;
  return (
    <Component
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
