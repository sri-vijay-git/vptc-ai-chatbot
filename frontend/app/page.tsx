"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bot, Sparkles, BookOpen, Calculator, MessageSquare, Shield, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import SplashScreen from "@/components/SplashScreen";
import QuickActionCard from "@/components/QuickActionCard";

export default function HomePage() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const [showSplash, setShowSplash] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Show splash on every page load
    useEffect(() => {
        setMounted(true);
        setShowSplash(true);
    }, []);

    const handleSplashComplete = () => {
        // Wait 2 seconds then hide splash
        setTimeout(() => {
            setShowSplash(false);
        }, 2000);
    };

    // Check for auth errors in URL hash (Supabase redirect)
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const error = hashParams.get('error');
            const errorDescription = hashParams.get('error_description');

            if (error) {
                // Clear hash
                window.history.replaceState(null, '', ' ');
                // Redirect to login with error
                router.push(`/login?error=${encodeURIComponent(errorDescription || 'Authentication failed')}`);
            }
        }
    }, [router]);

    const handleGetStarted = (query?: string) => {
        if (query) {
            router.push(`/chat?q=${encodeURIComponent(query)}`);
        } else {
            router.push("/chat");
        }
    };

    const exampleQuestions = [
        "What courses does VPTC offer?",
        "Tell me about admission requirements",
        "What is the fee structure?",
        "How can I apply for scholarships?"
    ];

    return (
        <>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
            <div className={`min-h-screen flex flex-col ${theme === "dark"
                ? "bg-gradient-to-br from-[#1a100e] via-[#2d1b15] to-[#3e2723]"
                : "bg-gradient-to-br from-[#ffffff] via-[#fff8e1] to-[#ffe0b2]"
                }`}>
                {/* Header */}
                <header className="w-full p-4 md:p-6 flex justify-center items-center relative">
                    {/* Centered Logo and Title */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-lg">
                            <Image
                                src="/logo.png"
                                alt="VPTC Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            VPTC AI
                        </span>
                    </div>

                    {/* Theme and Admin on the right - absolute positioned */}
                    <div className="absolute right-4 md:right-6 top-4 md:top-6 flex gap-3 items-center">
                        <button
                            onClick={() => router.push("/admin")}
                            className={`p-2 transition-colors ${theme === "dark"
                                ? "text-blue-200 hover:text-white"
                                : "text-[#1e3a5f] hover:text-[#2563eb]"
                                }`}
                            title="Admin Login"
                        >
                            <Shield className="w-5 h-5" />
                        </button>
                        <button
                            onClick={toggleTheme}
                            className={`p-2 transition-colors ${theme === "dark"
                                ? "text-blue-200 hover:text-white"
                                : "text-[#1e3a5f] hover:text-[#2563eb]"
                                }`}
                            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                </header>

                {/* Secondary Row - Login/Signup */}
                <div className="w-full px-4 pb-4 flex justify-center gap-4">
                    <button
                        onClick={() => router.push("/login")}
                        className={`px-4 md:px-6 py-2 text-sm font-medium transition-colors ${theme === "dark"
                            ? "text-blue-100 hover:text-white"
                            : "text-[#1e3a5f] hover:text-[#0a1628]"
                            }`}
                    >
                        Log in
                    </button>
                    <button
                        onClick={() => router.push("/signup")}
                        className={`px-4 md:px-6 py-2 text-sm font-medium rounded-full transition-colors shadow-lg ${theme === "dark"
                            ? "bg-[#ffcc80] text-[#3e2723] hover:bg-[#ffe0b2]"
                            : "bg-[#3e2723] text-white hover:bg-[#5d4037]"
                            }`}
                    >
                        Sign up for free
                    </button>
                </div>

                {/* Main Content - Centered */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#0a1628] dark:text-white mb-12 text-center">
                        What can I help with?
                    </h1>

                    {/* Input Box */}
                    <div className="w-full max-w-3xl">
                        <div className="relative bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden hover:shadow-xl transition-all">

                            <input
                                type="text"
                                placeholder="Ask anything about VPTC..."
                                onClick={() => handleGetStarted()}
                                readOnly
                                className="w-full px-6 py-5 text-lg bg-transparent outline-none text-[#0a1628] placeholder-gray-400 cursor-pointer"
                            />

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 px-4 pb-4">
                                <button
                                    onClick={() => handleGetStarted("What courses does VPTC offer?")}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-[#1e3a5f] hover:bg-blue-50 rounded-lg transition-all"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    <span className="hidden sm:inline">Courses</span>
                                </button>
                                <button
                                    onClick={() => handleGetStarted("What is the fee structure?")}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-[#1e3a5f] hover:bg-blue-50 rounded-lg transition-all"
                                >
                                    <Calculator className="w-4 h-4" />
                                    <span className="hidden sm:inline">Fees</span>
                                </button>
                                <button
                                    onClick={() => handleGetStarted()}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-[#1e3a5f] hover:bg-blue-50 rounded-lg transition-all"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="hidden sm:inline">Ask AI</span>
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="w-full max-w-4xl mx-auto mt-12 px-4 animate-fadeIn">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 text-center">
                                Quick Actions
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <QuickActionCard
                                    icon="📋"
                                    title="Admission Status"
                                    description="Check your application"
                                    onClick={() => router.push('/chat?q=What is my admission status')}
                                />
                                <QuickActionCard
                                    icon="💰"
                                    title="Fee Calculator"
                                    description="Calculate course fees"
                                    onClick={() => router.push('/chat?q=Calculate fees for my course')}
                                />
                                <QuickActionCard
                                    icon="📄"
                                    title="Download Forms"
                                    description="Application forms"
                                    onClick={() => router.push('/chat?q=Where can I download application forms')}
                                />
                                <QuickActionCard
                                    icon="📅"
                                    title="Important Dates"
                                    description="Deadlines & events"
                                    onClick={() => router.push('/chat?q=Show me important dates and deadlines')}
                                />
                                <QuickActionCard
                                    icon="🎓"
                                    title="Course Details"
                                    description="Browse programs"
                                    onClick={() => router.push('/chat?q=Show me all available courses')}
                                />
                                <QuickActionCard
                                    icon="📊"
                                    title="Placements"
                                    description="Job statistics"
                                    onClick={() => router.push('/chat?q=Tell me about placement statistics')}
                                />
                                <QuickActionCard
                                    icon="💳"
                                    title="Scholarships"
                                    description="Financial aid"
                                    onClick={() => router.push('/chat?q=What scholarships are available')}
                                />
                                <QuickActionCard
                                    icon="📞"
                                    title="Contact"
                                    description="Get in touch"
                                    onClick={() => router.push('/chat?q=How can I contact the admission office')}
                                />
                            </div>
                        </div>

                        {/* Example Questions */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {exampleQuestions.map((question, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleGetStarted(question)}
                                    className="text-left p-4 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-xl hover:bg-white hover:shadow-lg transition-all group"
                                >
                                    <div className="flex items-start gap-3">
                                        <Sparkles className="w-4 h-4 mt-1 text-[#2563eb] opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                        <span className="text-sm text-[#1e3a5f] group-hover:text-[#0a1628] font-medium">
                                            {question}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>


                </div>

                {/* Footer */}
                <footer className={`w-full py-4 text-center text-sm ${theme === "dark" ? "text-[#d7ccc8]" : "text-[#5d4037]"}`}>
                    By using VPTC AI, you agree to our terms.
                    <span className="mx-2">•</span>
                    Powered by Groq AI
                </footer>
            </div>
        </>
    );
}
