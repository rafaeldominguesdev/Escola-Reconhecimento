import React from "react";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="relative">
        {/* Central Green Dot */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 bg-sid-green rounded-full shadow-[0_0_20px_rgba(46,204,113,0.5)] flex items-center justify-center z-10 relative"
        />
        
        {/* Spinning Rays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-full h-full relative"
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <div
                key={angle}
                className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-1 bg-sid-yellow origin-bottom rounded-full"
                style={{
                  transform: `rotate(${angle}deg) translateY(32px)`,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Outer Glow Ring */}
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-sid-green/20 rounded-full"
        />
      </div>

      <div className="text-center space-y-3">
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-serif font-semibold"
        >
          Analisando cenários de descarbonização...
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-muted-foreground animate-pulse"
        >
          Calculando as melhores estratégias para seu orçamento
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingScreen;
