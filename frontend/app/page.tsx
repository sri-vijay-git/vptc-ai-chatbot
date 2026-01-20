"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bot, Sparkles, BookOpen, Calculator, MessageSquare, Shield, Sun, Moon, Menu, X } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

export default function HomePage() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className={`min-h-screen flex flex-col ${theme === "dark"
            ? "bg-gradient-to-br from-[#3e2723] via-[#5d4037] to-[#4e342e]"
            : "bg-gradient-to-br from-[#efebe9] via-[#d7ccc8] to-[#bcaaa4]"
            }`}>
            {/* Header */}
            <header className="w-full p-4 md:p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-md">
                        <Image
                            src="/logo.png"
                            alt="VPTC Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                        VPTC AI
                    </span>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`md:hidden p-2 rounded-lg transition-colors ${theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-black/5"
                        }`}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-3 items-center">
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
                            ? "bg-white text-[#0a1628] hover:bg-blue-50"
                            : "bg-[#2563eb] text-white hover:bg-[#1e3a5f]"
                            }`}
                    >
                        Sign up for free
                    </button>
                </div>
            </header >

            {/* Mobile Menu Dropdown */}
            {
                isMobileMenuOpen && (
                    <div className={`md:hidden absolute top-16 left-0 w-full p-4 shadow-xl z-50 ${theme === "dark" ? "bg-[#1e3a5f] border-b border-white/10" : "bg-white border-b border-gray-100"
                        }`}>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                                <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Appearance</span>
                                <button
                                    onClick={toggleTheme}
                                    className={`p-2 rounded-lg ${theme === "dark" ? "bg-black/20 text-white" : "bg-gray-100 text-gray-900"}`}
                                >
                                    {theme === "dark" ? (
                                        <div className="flex items-center gap-2"><Sun className="w-4 h-4" /> Light</div>
                                    ) : (
                                        <div className="flex items-center gap-2"><Moon className="w-4 h-4" /> Dark</div>
                                    )}
                                </button>
                            </div>
                            <button
                                onClick={() => router.push("/admin")}
                                className={`flex items-center gap-3 p-2 rounded-lg ${theme === "dark" ? "text-blue-200 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"}`}
                            >
                                <Shield className="w-5 h-5" /> Admin Login
                            </button>
                            <button
                                onClick={() => router.push("/login")}
                                className={`flex items-center gap-3 p-2 rounded-lg ${theme === "dark" ? "text-blue-200 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"}`}
                            >
                                <Bot className="w-5 h-5" /> Log in
                            </button>
                            <button
                                onClick={() => router.push("/signup")}
                                className="w-full py-3 text-center bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                            >
                                Sign up for free
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Main Content - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
                {/* Main Heading */}
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-[#0a1628] dark:text-white mb-8 md:mb-12 text-center px-2">
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
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-4 pb-4">
                            <button
                                onClick={() => handleGetStarted("What courses does VPTC offer?")}
                                className="flex items-center justify-center sm:justify-start gap-2 px-3 py-3 sm:py-2 text-sm text-[#1e3a5f] bg-gray-50 sm:bg-transparent hover:bg-blue-50 rounded-lg transition-all"
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>Courses</span>
                            </button>
                            <button
                                onClick={() => handleGetStarted("What is the fee structure?")}
                                className="flex items-center justify-center sm:justify-start gap-2 px-3 py-3 sm:py-2 text-sm text-[#1e3a5f] bg-gray-50 sm:bg-transparent hover:bg-blue-50 rounded-lg transition-all"
                            >
                                <Calculator className="w-4 h-4" />
                                <span>Fees</span>
                            </button>
                            <button
                                onClick={() => handleGetStarted()}
                                className="flex items-center justify-center sm:justify-start gap-2 px-3 py-3 sm:py-2 text-sm text-[#1e3a5f] bg-gray-50 sm:bg-transparent hover:bg-blue-50 rounded-lg transition-all"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span>Ask AI</span>
                            </button>
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
        </div >
    );
}
