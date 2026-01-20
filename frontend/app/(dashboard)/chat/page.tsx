"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import api from "@/lib/api";
import { User, Send, StopCircle, RefreshCw, Copy, Check, ThumbsUp, ThumbsDown, Sparkles, AlertTriangle, LogOut, Sun, Moon, UserCircle, ChevronDown, Settings } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useGuestMode } from "@/hooks/useGuestMode";
import SignupPrompt from "@/components/SignupPrompt";
import { useTheme } from "@/contexts/ThemeContext";

// Types
type Message = {
    role: "user" | "assistant";
    content: string;
    sources?: string[];
};

function ChatContent() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I am your VPTC AI Advisor. Ask me anything about courses, fees, or exams." }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Guest Mode
    const {
        isGuest,
        showSignupPrompt,
        incrementConversation,
        getRemainingConversations,
        canChat,
        guestLimit
    } = useGuestMode();

    const remaining = getRemainingConversations();

    // State
    const [showModal, setShowModal] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const hasAutoSent = useRef(false);

    // Handle auto-send from homepage query
    useEffect(() => {
        const query = searchParams.get('q');
        if (query && !hasAutoSent.current && !loading) {
            setInput(query);
            hasAutoSent.current = true;
            // Use a small timeout to ensure state is ready
            setTimeout(() => {
                const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
                sendMessage(fakeEvent, query);
            }, 100);
        }
    }, [searchParams]);



    // Get user email on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !isGuest) {
            // Try to get email from localStorage or decode token
            const email = localStorage.getItem('user_email') || 'user@example.com';
            setUserEmail(email);
        }
    }, [isGuest]);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (showSignupPrompt) {
            setShowModal(true);
        }
    }, [showSignupPrompt]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    const sendMessage = async (e: React.FormEvent, overrideMessage?: string) => {
        if (e && e.preventDefault) e.preventDefault();

        const messageToSend = overrideMessage || input;
        if (!messageToSend.trim()) return;

        // Check if guest can chat
        if (isGuest && !canChat()) {
            setShowModal(true);
            return;
        }

        const userMsg = messageToSend.trim();
        setInput("");

        // Add User Message
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setLoading(true);

        try {
            // All users (guests and logged-in) get REAL AI responses!
            const response = await api.post("/chat/message", { message: userMsg });
            const aiResponse = response.data;

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: aiResponse.answer,
                    sources: aiResponse.sources
                }
            ]);

            // Track guest conversations
            if (isGuest) {
                incrementConversation();
            }
        } catch (error: any) {
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: "Sorry, I'm having trouble right now. Please try again or sign up for full access."
            }]);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-[#efebe9] via-[#d7ccc8] to-[#bcaaa4] dark:from-[#3e2723] dark:via-[#5d4037] dark:to-[#4e342e]">
            {/* Signup Prompt Modal */}
            <SignupPrompt
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                conversationsUsed={guestLimit}
                totalLimit={guestLimit}
            />

            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                        <Image
                            src="/logo.png"
                            alt="VPTC Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">VPTC AI Chatbot</h1>
                        {isGuest && remaining > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {remaining} free {remaining === 1 ? 'chat' : 'chats'} remaining
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    >
                        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* User Profile Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                        >
                            {isGuest ? (
                                <UserCircle className="w-5 h-5" />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                    {(userEmail ? userEmail.charAt(0).toUpperCase() : 'U')}
                                </div>
                            )}
                            <span className="text-sm hidden md:inline font-medium">
                                {isGuest ? 'Guest' : (userEmail?.split('@')[0] || 'User')}
                            </span>
                            <ChevronDown className="w-4 h-4 opacity-70" />
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileDropdown && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                                {/* Profile Info */}
                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                        {isGuest ? 'Guest Mode' : 'Logged In'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {isGuest ? `${remaining} free chats left` : (userEmail || 'No email')}
                                    </p>
                                </div>

                                {/* Profile Settings */}
                                {!isGuest && (
                                    <button
                                        onClick={() => {
                                            setShowProfileDropdown(false);
                                            router.push("/profile");
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Profile Settings
                                    </button>
                                )}

                                {/* Logout Button */}
                                <button
                                    onClick={() => {
                                        setShowProfileDropdown(false);
                                        handleLogout();
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    {isGuest ? 'Exit' : 'Logout'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            < div className="flex-1 overflow-y-auto p-4 space-y-4" >
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
                            <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user"
                                    ? "bg-primary text-white"
                                    : "bg-gradient-to-br from-secondary to-accent text-gray-700"
                                    }`}>
                                    {msg.role === "user" ? <User className="w-5 h-5" /> : (
                                        <div className="relative w-full h-full rounded-full overflow-hidden">
                                            <Image
                                                src="/logo.png"
                                                alt="AI"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Message Bubble */}
                                <div className={`rounded-2xl p-4 shadow-sm ${msg.role === "user"
                                    ? "bg-primary text-white rounded-tr-sm"
                                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-200 dark:border-gray-700"
                                    }`}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    {msg.sources && msg.sources.length > 0 && (
                                        (() => {
                                            const filteredSources = msg.sources!.filter(s => s !== "General Knowledge");
                                            if (filteredSources.length === 0) return null;
                                            return (
                                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs opacity-75">
                                                    <span className="font-semibold">Sources:</span> {filteredSources.join(", ")}
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {loading && (
                        <div className="flex justify-start animate-fadeIn">
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0 relative">
                                    <Image
                                        src="/logo.png"
                                        alt="AI"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-200 dark:border-gray-700">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div >

            {/* Input Area */}
            < div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700" >
                <form onSubmit={sendMessage} className="max-w-4xl mx-auto">
                    <div className="flex gap-2 items-center bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 p-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your college..."
                            className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            disabled={loading || (isGuest && !canChat())}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim() || (isGuest && !canChat())}
                            className="p-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    {isGuest && remaining === 0 && (
                        <p className="text-center text-sm text-red-600 dark:text-red-400 mt-2">
                            Free trial limit reached. Please sign up to continue.
                        </p>
                    )}
                </form>
            </div >
        </div >
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
