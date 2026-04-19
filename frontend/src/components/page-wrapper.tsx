"use client"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
        type: "spring", stiffness: 150, damping: 25, mass: 1
    },
  },
}


export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  )
}

export function AnimatedItem({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div variants={itemVariants} className={className}>
            {children}
        </motion.div>
    )
}
