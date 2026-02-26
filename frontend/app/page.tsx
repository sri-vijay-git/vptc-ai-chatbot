"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight, Zap, Clock, BookOpen, Shield, Sun, Moon, Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

export default function HomePage() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const [promptInput, setPromptInput] = useState("");
    const [showSplash, setShowSplash] = useState(true);

    // Splash screen effect
    useEffect(() => {
        // Hide splash screen after 2 seconds
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e?: React.FormEvent, query?: string) => {
        e?.preventDefault();
        const searchQuery = query || promptInput;
        if (searchQuery.trim()) {
            router.push(`/chat?q=${encodeURIComponent(searchQuery)}`);
        } else {
            router.push("/chat");
        }
    };

    // Example prompts - VPTC Context
    const examplePrompts = [
        { icon: "📚", text: "Tell me about Mechanical Engineering" },
        { icon: "🎓", text: "How to apply for Lateral Entry?" },
        { icon: "🚌", text: "Is college bus facility available?" },
    ];

    // Features - VPTC Context
    const features = [
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: "Instant College Info",
            description: "Get immediate answers about courses, fees, and admissions"
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "24/7 Student Support",
            description: "Your AI assistant is always ready to help prospective students"
        },
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: "Academic Details",
            description: "Explore syllabus, lab facilities, and faculty information"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Official Updates",
            description: "Trusted information directly from Vignesh Polytechnic College"
        },
    ];

    return (
        <>
            {/* Splash Screen */}
            {showSplash && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF7F2] dark:bg-[#1A100E] animate-[fadeOut_0.5s_ease-out_1.5s_forwards]">
                    <div className="text-center animate-[bounceIn_0.8s_ease-out]">
                        <div className="relative w-32 h-32 mx-auto mb-4 animate-[zoomPulse_1.5s_ease-in-out_infinite]">
                            <Image src="/logo.png" alt="VPTC" fill className="object-cover rounded-full" />
                        </div>
                        <h1 className="text-4xl font-bold text-[#3E2723] dark:text-[#FFCC80] mb-2 animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
                            VPTC AI
                        </h1>
                        <p className="text-lg text-[#5D4037] dark:text-[#FFCC80]/70 animate-[fadeInUp_0.8s_ease-out_0.5s_both]">
                            Your College Assistant
                        </p>
                    </div>


                </div>
            )}

            {/* Main Homepage */}
            <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#1A100E] relative overflow-hidden">
                {/* Animated Glowing Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-300/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/15 to-amber-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
                    <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-300/10 rounded-full blur-2xl animate-pulse delay-500" />
                </div>

                {/* Hero Section - Gemini Style */}
                <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative z-10">
                    <div className="w-full max-w-3xl text-center space-y-8">
                        {/* College Logo */}
                        <div className="flex justify-center">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#FFCC80] to-[#FFB74D] rounded-full blur-lg opacity-50 animate-pulse" />
                                <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-xl border-2 border-[#8B6F47]/30 dark:border-[#FFCC80]/30">
                                    <Image
                                        src="/logo.png"
                                        alt="VPTC Logo"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Main Heading */}
                        <div className="space-y-4">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#3E2723] dark:text-[#FFCC80]">
                                What can I help You?
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-[#5D4037] dark:text-[#FFCC80]/70">
                                Your Guide to Excellence in Technical Education
                            </p>
                        </div>

                        {/* Large Prompt Input - Gemini Style with RGB Border */}
                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="relative group">
                                {/* RGB Animated Border */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-[gradient_3s_linear_infinite] bg-[length:200%_200%]"
                                    style={{ backgroundSize: '200% 200%', animation: 'gradient 3s linear infinite' }} />



                                <div className="relative">
                                    <input
                                        type="text"
                                        value={promptInput}
                                        onChange={(e) => setPromptInput(e.target.value)}
                                        placeholder="Ask about courses, admissions, fees..."
                                        className="w-full px-4 sm:px-6 py-3 sm:py-5 text-sm sm:text-base md:text-lg rounded-2xl border-2 border-transparent bg-white dark:bg-[#2D1B15] text-[#3E2723] dark:text-[#FFCC80] focus:outline-none relative z-10 transition-all shadow-lg hover:shadow-2xl"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-[#8B6F47] hover:bg-[#6D563C] text-white rounded-xl transition-all hover:scale-105 z-20"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Example Prompts - Chip Style */}
                        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                            {examplePrompts.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSubmit(undefined, prompt.text)}
                                    className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-white dark:bg-[#2D1B15] border border-[#D7CCC8] dark:border-[#5D4037]
                                         rounded-full text-xs sm:text-sm text-[#5D4037] dark:text-[#FFCC80] 
                                         hover:border-[#8B6F47] dark:hover:border-[#FFCC80] hover:shadow-md
                                         transition-all flex items-center gap-1 sm:gap-2"
                                >
                                    <span>{prompt.icon}</span>
                                    <span>{prompt.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Features Section - Simplified Grid */}
                <section className="w-full px-4 py-16 bg-white/50 dark:bg-black/20">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#3E2723] dark:text-[#FFCC80] mb-8 sm:mb-12">
                            Why Choose VPTC AI?
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="p-6 bg-white dark:bg-[#2D1B15] rounded-2xl border border-[#D7CCC8] dark:border-[#5D4037]
                                         hover:shadow-lg transition-all text-center space-y-3"
                                >
                                    <div className="inline-flex p-4 bg-[#FAF7F2] dark:bg-[#3E2723] rounded-xl text-[#8B6F47] dark:text-[#FFCC80]">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#3E2723] dark:text-[#FFCC80]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-[#5D4037] dark:text-[#FFCC80]/70">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Simple Footer */}
                <footer className="w-full px-6 py-8 border-t border-[#D7CCC8] dark:border-[#3E2723] text-center">
                    <p className="text-sm text-[#5D4037] dark:text-[#FFCC80]/70">
                        © 2026 Vignesh Polytechnic College. Powered by AI.
                    </p>
                    <div className="flex gap-6 justify-center mt-4">
                        <button
                            onClick={() => router.push("/about")}
                            className="text-sm text-[#5D4037] dark:text-[#FFCC80]/80 hover:text-[#3E2723] dark:hover:text-[#FFCC80]"
                        >
                            About
                        </button>
                        <button
                            onClick={() => router.push("/contact")}
                            className="text-sm text-[#5D4037] dark:text-[#FFCC80]/80 hover:text-[#3E2723] dark:hover:text-[#FFCC80]"
                        >
                            Contact
                        </button>
                        <button
                            onClick={() => router.push("/admissions")}
                            className="text-sm text-[#5D4037] dark:text-[#FFCC80]/80 hover:text-[#3E2723] dark:hover:text-[#FFCC80]"
                        >
                            Admissions
                        </button>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex gap-5 justify-center mt-5">
                        <a
                            href="https://www.facebook.com/VPTCTVM"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="p-2 rounded-full text-[#5D4037] dark:text-[#FFCC80]/70 hover:text-[#1877F2] dark:hover:text-[#1877F2] hover:bg-[#1877F2]/10 transition-all"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a
                            href="https://www.instagram.com/vignesh.vpt?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="p-2 rounded-full text-[#5D4037] dark:text-[#FFCC80]/70 hover:text-[#E1306C] dark:hover:text-[#E1306C] hover:bg-[#E1306C]/10 transition-all"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>

                    </div>
                </footer>
            </div>
        </>
    );
}
