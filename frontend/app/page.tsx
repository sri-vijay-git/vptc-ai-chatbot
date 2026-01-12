"use client";

import { useRouter } from "next/navigation";
import { Bot, Sparkles, BookOpen, Calculator, MessageSquare } from "lucide-react";

export default function HomePage() {
    const router = useRouter();

    const handleGetStarted = () => {
        router.push("/chat");
    };

    const exampleQuestions = [
        "What courses does VPTC offer?",
        "Tell me about admission requirements",
        "What is the fee structure?",
        "How can I apply for scholarships?"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-secondary-light/30 to-accent/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
            {/* Header */}
            <header className="w-full p-4 md:p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                        VPTC AI
                    </span>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push("/login")}
                        className="px-4 md:px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                    >
                        Log in
                    </button>
                    <button
                        onClick={() => router.push("/signup")}
                        className="px-4 md:px-6 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity"
                    >
                        Sign up for free
                    </button>
                </div>
            </header>

            {/* Main Content - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 dark:text-white mb-12 text-center">
                    What can I help with?
                </h1>

                {/* Input Box */}
                <div className="w-full max-w-3xl">
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                        <input
                            type="text"
                            placeholder="Ask anything about VPTC..."
                            onClick={handleGetStarted}
                            readOnly
                            className="w-full px-6 py-5 text-lg bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 cursor-pointer"
                        />

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 px-4 pb-4">
                            <button
                                onClick={handleGetStarted}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                            >
                                <BookOpen className="w-4 h-4" />
                                <span className="hidden sm:inline">Courses</span>
                            </button>
                            <button
                                onClick={handleGetStarted}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                            >
                                <Calculator className="w-4 h-4" />
                                <span className="hidden sm:inline">Fees</span>
                            </button>
                            <button
                                onClick={handleGetStarted}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
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
                                onClick={handleGetStarted}
                                className="text-left p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white dark:hover:bg-gray-800 hover:border-primary/50 transition-all group"
                            >
                                <div className="flex items-start gap-3">
                                    <Sparkles className="w-4 h-4 mt-1 text-primary opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                                        {question}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Try it now CTA */}
                <div className="mt-12 text-center">
                    <button
                        onClick={handleGetStarted}
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-full hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        <Bot className="w-5 h-5" />
                        Try VPTC AI for Free
                        <span className="text-xs opacity-75">(20 conversations free!)</span>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                By using VPTC AI, you agree to our terms.
                <span className="mx-2">•</span>
                Powered by Groq AI
            </footer>
        </div>
    );
}
