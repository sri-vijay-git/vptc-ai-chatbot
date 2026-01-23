"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const { theme } = useTheme();

    return (
        <motion.div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden ${theme === "dark"
                    ? "bg-gradient-to-br from-[#1a100e] via-[#2d1b15] to-[#3e2723]"
                    : "bg-gradient-to-br from-[#ffffff] via-[#fff8e1] to-[#ffe0b2]"
                }`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={onComplete}
        >
            {/* Logo with zoom-in animation */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 0.8,
                    ease: "easeOut",
                }}
                className="relative w-32 h-32 mb-6"
            >
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl">
                    <Image
                        src="/logo.png"
                        alt="VPTC Logo"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </motion.div>

            {/* Title with fade-in animation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: "easeOut",
                }}
                className="text-center"
            >
                <h1
                    className={`text-4xl md:text-5xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-[#0a1628]"
                        }`}
                >
                    VPTC AI
                </h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.6,
                    }}
                    className={`text-lg ${theme === "dark" ? "text-[#d7ccc8]" : "text-[#5d4037]"
                        }`}
                >
                    Your Intelligent Campus Assistant
                </motion.p>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.4,
                    delay: 1,
                }}
                className="mt-12"
            >
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className={`w-2 h-2 rounded-full ${theme === "dark" ? "bg-[#ffcc80]" : "bg-[#3e2723]"
                                }`}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
