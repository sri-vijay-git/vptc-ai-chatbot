"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import { Send, LogOut, Bot, User, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGuestMode } from "@/hooks/useGuestMode";
import SignupPrompt from "@/components/SignupPrompt";

// Types
type Message = {
    role: "user" | "assistant";
    content: string;
    sources?: string[];
};

export default function ChatPage() {
    const router = useRouter();
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

    const [showModal, setShowModal] = useState(false);

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

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Check if guest can chat
        if (isGuest && !canChat()) {
            setShowModal(true);
            return;
        }

        const userMsg = input.trim();
        setInput("");

        // Add User Message
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setLoading(true);

        try {
            // For guest users, provide demo response without backend call
            if (isGuest) {
                // Simulate API delay for realism
                await new Promise(resolve => setTimeout(resolve, 1500));

                const demoResponse = `Thank you for trying VPTC AI Chatbot! 🎓

I'm your AI assistant for Vignesh Polytechnic College. I can help you with:
• Course information & syllabus
• Admission requirements & procedures  
• Fee structure & scholarships
• Exam schedules & results
• Campus facilities & events

**Sign up for FREE** to unlock:
✨ Unlimited AI conversations
✨ Real-time document-based answers
✨ GPA calculator
✨ Personalized academic guidance

Demo chats remaining: **${getRemainingConversations() - 1}**`;

                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: demoResponse,
                        sources: ["VPTC Demo Mode"]
                    }
                ]);

                incrementConversation();
            } else {
                // Authenticated users get real AI responses from backend
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

    const remaining = getRemainingConversations();

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-secondary-light to-white dark:from-gray-900 dark:to-gray-800">
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
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
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
                <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    {isGuest ? 'Exit' : 'Logout'}
                </button>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
                            <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user"
                                    ? "bg-primary text-white"
                                    : "bg-gradient-to-br from-secondary to-accent text-gray-700"
                                    }`}>
                                    {msg.role === "user" ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                </div>

                                {/* Message Bubble */}
                                <div className={`rounded-2xl p-4 shadow-sm ${msg.role === "user"
                                    ? "bg-primary text-white rounded-tr-sm"
                                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-200 dark:border-gray-700"
                                    }`}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs opacity-75">
                                            <span className="font-semibold">Sources:</span> {msg.sources.join(", ")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {loading && (
                        <div className="flex justify-start animate-fadeIn">
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-5 h-5 text-gray-700" />
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
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={sendMessage} className="max-w-4xl mx-auto">
                    <div className="flex gap-2 items-center bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 p-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your college..."
                            className="flex-1 px-4 py-2 bg-transparent focus:outline-none dark:text-white placeholder-gray-400"
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
            </div>
        </div>
    );
}
