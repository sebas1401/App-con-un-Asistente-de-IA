import { motion } from "framer-motion";
import clsx from "clsx";
import React from "react";

export default function Button({
  className, children, ...rest
}: React.ComponentPropsWithoutRef<typeof motion.button>) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      className={clsx(
        "px-4 py-2 rounded-xl text-white font-medium",
        "bg-gradient-to-r from-indigo-600 to-fuchsia-600",
        "shadow-[0_10px_30px_rgba(99,102,241,.25)] hover:opacity-95 transition",
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
