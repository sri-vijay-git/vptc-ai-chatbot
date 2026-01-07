"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import { Send, LogOut, Bot, User } from "lucide-react";
import { useRouter } from "next/navigation";

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

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput("");

        // Add User Message
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setLoading(true);

        try {
            const response = await api.post("/chat/message", { message: userMsg });

            const aiResponse = response.data;

            // Add AI Message
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: aiResponse.answer,
                    sources: aiResponse.sources
                }
            ]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble retrieving that information right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                    <Bot className="w-6 h-6" /> VPTC Chatbot
                </h1>
                <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1">
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === "user"
                                ? "bg-primary text-white rounded-br-none"
                                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm"
                            }`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs opacity-70">
                                    <span className="font-semibold">Sources:</span> {msg.sources.join(", ")}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg rounded-bl-none shadow-sm animate-pulse">
                            typing...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={sendMessage} className="flex gap-2 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your college..."
                        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="p-2 bg-primary text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
