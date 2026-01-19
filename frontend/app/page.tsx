"use client";

import { useRouter } from "next/navigation";
import { Bot, Sparkles, BookOpen, Calculator, MessageSquare, Shield, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

export default function HomePage() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

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
                <div className="flex gap-3 items-center">
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
            </header>

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
    );
}
