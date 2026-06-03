import { useEffect } from "react";
import { motion } from "framer-motion";

export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      suppressHydrationWarning
      className="fixed inset-0 z-[9999] bg-[#F8F6F2] overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Scene 1: Golden Thread */}
      <Scene1 />

      {/* Scene 2: The Loom */}
      <Scene2 />

      {/* Scene 3: Flowing Saree */}
      <Scene3 />

      {/* Scene 4: Logo Reveal */}
      <Scene4 />

      {/* Final Fade Out */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 2.95 }}
        className="absolute inset-0 bg-gradient-to-b from-[#F8F6F2] to-white"
        suppressHydrationWarning
      />
    </div>
  );
}

function Scene1() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0 }}
      className="absolute inset-0 flex items-center justify-center"
      suppressHydrationWarning
    >
      <svg
        viewBox="0 0 800 200"
        className="absolute w-full max-w-4xl h-auto"
        suppressHydrationWarning
      >
        {/* Golden Thread moving across */}
        <motion.path
          d="M 0 100 Q 100 60 200 100 T 400 100 T 600 100 T 800 100"
          stroke="#FFD700"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Glow effect */}
        <motion.path
          d="M 0 100 Q 100 60 200 100 T 400 100 T 600 100 T 800 100"
          stroke="#FFD700"
          strokeWidth="8"
          fill="none"
          opacity={0.2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Floating particles following thread */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.circle
            key={`particle-${i}`}
            cx={0}
            cy={100}
            r="2"
            fill="#FFD700"
            initial={{ opacity: 0, cx: 0 }}
            animate={{ opacity: [0, 0.8, 0], cx: 800 }}
            transition={{
              duration: 0.5,
              delay: i * 0.05,
              ease: "easeInOut",
            }}
            suppressHydrationWarning
          />
        ))}
      </svg>
    </motion.div>
  );
}

function Scene2() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="absolute inset-0 flex items-center justify-center"
      suppressHydrationWarning
    >
      <svg
        viewBox="0 0 400 400"
        className="w-80 h-80"
        suppressHydrationWarning
      >
        {/* Vertical threads */}
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.line
            key={`v-${i}`}
            x1={80 + i * 60}
            y1="50"
            x2={80 + i * 60}
            y2="350"
            stroke="#FFD700"
            strokeWidth="2"
            opacity={0.8}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
            suppressHydrationWarning
          />
        ))}

        {/* Horizontal threads weaving */}
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.line
            key={`h-${i}`}
            x1="50"
            y1={100 + i * 50}
            x2="350"
            y2={100 + i * 50}
            stroke="#FFD700"
            strokeWidth="2"
            opacity={0.6}
            initial={{ opacity: 0, x1: 200, x2: 200 }}
            animate={{ opacity: 0.6, x1: 50, x2: 350 }}
            transition={{
              duration: 0.5,
              delay: 0.7 + i * 0.1,
              ease: "easeInOut",
            }}
            suppressHydrationWarning
          />
        ))}

        {/* Fabric texture forming */}
        <motion.rect
          x="60"
          y="80"
          width="280"
          height="240"
          fill="#dc3545"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          rx="4"
          suppressHydrationWarning
        />

        {/* Gold border shimmer */}
        <motion.rect
          x="60"
          y="80"
          width="280"
          height="240"
          fill="none"
          stroke="#FFD700"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          rx="4"
          suppressHydrationWarning
        />
      </svg>

      {/* Scene 2 Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="absolute bottom-20 text-center"
        suppressHydrationWarning
      >
        <p className="text-[#0D3B66] text-lg md:text-xl font-light tracking-widest">
          Woven With Heritage
        </p>
      </motion.div>
    </motion.div>
  );
}

function Scene3() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 1.4 }}
      className="absolute inset-0 flex items-center justify-center"
      suppressHydrationWarning
    >
      <svg
        viewBox="0 0 600 400"
        className="w-96 h-96"
        suppressHydrationWarning
      >
        <defs>
          <linearGradient
            id="sareeGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#dc3545" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#FFD700" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8B0000" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Flowing saree body */}
        <motion.path
          d="M 150 50 L 100 150 L 80 300 L 520 320 L 500 150 L 450 50 Z"
          fill="url(#sareeGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          suppressHydrationWarning
        />

        {/* Pallu flowing to right */}
        <motion.path
          d="M 450 50 Q 520 80 550 150 Q 570 200 550 280 L 520 320"
          fill="#FFD700"
          opacity={0.4}
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 0.4, pathLength: 1 }}
          transition={{ duration: 0.7, delay: 1.6 }}
          suppressHydrationWarning
        />

        {/* Zari border glow */}
        <motion.ellipse
          cx="300"
          cy="180"
          rx="200"
          ry="120"
          fill="none"
          stroke="#FFD700"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.2, delay: 1.6 }}
          suppressHydrationWarning
        />

        {/* Saree wave motion */}
        <motion.path
          d="M 150 50 L 100 150 L 80 300 L 520 320 L 500 150 L 450 50 Z"
          fill="none"
          stroke="#FFD700"
          strokeWidth="1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          suppressHydrationWarning
        />

        {/* Fabric shimmer */}
        <motion.ellipse
          cx="200"
          cy="150"
          rx="80"
          ry="100"
          fill="white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 1, delay: 1.8 }}
          suppressHydrationWarning
        />
      </svg>
    </motion.div>
  );
}

function Scene4() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 2.3 }}
      className="absolute inset-0 flex flex-col items-center justify-center"
      suppressHydrationWarning
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 2.3, ease: "easeOut" }}
        className="relative text-center mb-6"
        suppressHydrationWarning
      >
        <h1 className="text-5xl md:text-6xl font-bold text-[#dc3545]">
          CraftMySarees
        </h1>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 text-5xl md:text-6xl font-bold text-[#FFD700]"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: 2,
            delay: 2.3,
            repeat: Infinity,
          }}
          style={{
            textShadow: "0 0 20px rgba(255, 215, 0, 0.6)",
            filter: "blur(0.5px)",
          }}
          suppressHydrationWarning
        >
          CraftMySarees
        </motion.div>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2.6 }}
        className="text-[#FFD700] text-sm md:text-base font-light tracking-widest"
        suppressHydrationWarning
      >
        Where Tradition Meets Elegance
      </motion.p>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 2.4 }}
        className="w-24 h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent mt-4"
        suppressHydrationWarning
      />
    </motion.div>
  );
}
