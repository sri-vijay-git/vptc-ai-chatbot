"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import api from "@/lib/api";
import { User, Send, StopCircle, RefreshCw, Copy, Check, ThumbsUp, ThumbsDown, Sparkles, AlertTriangle, LogOut, Sun, Moon, UserCircle, ChevronDown, Settings, Menu, X, Plus, MessageSquare, Trash2, Edit2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useGuestMode } from "@/hooks/useGuestMode";
import SignupPrompt from "@/components/SignupPrompt";
import ChatHistoryModal from "@/components/ChatHistoryModal";
import { useTheme } from "@/contexts/ThemeContext";
import { useProfilePic } from "@/hooks/useProfilePic";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import TextareaAutosize from 'react-textarea-autosize';

// Types
type Message = {
    role: "user" | "assistant";
    content: string;
    sources?: string[];
    followupQuestions?: string[];
    rating?: number; // 1 for helpful, -1 for not helpful
    isTyping?: boolean; // For typing animation
};

type Conversation = {
    id: string;
    title: string;
    date: string;
    preview: string;
    messages: Message[];
};

function ChatContent() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const profilePic = useProfilePic();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I am your Vignesh Polytechnic College (VPTC) AI Advisor. Ask me anything about our Diploma courses, admissions, or campus facilities." }
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
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const searchParams = useSearchParams();

    // Typing animation state
    const [typingMessageIndex, setTypingMessageIndex] = useState<number | null>(null);
    const [displayedText, setDisplayedText] = useState<string>("");
    const hasAutoSent = useRef(false);

    // Sidebar State
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentChatId, setCurrentChatId] = useState<string>("1");

    // Mock conversation history (in production, fetch from backend)
    const [conversations, setConversations] = useState<Conversation[]>([
        { id: "1", title: "VPTC AI Advisor", date: "Today", preview: "Hello! I am your VPTC AI...", messages: [{ role: "assistant", content: "Hello! I am your Vignesh Polytechnic College (VPTC) AI Advisor." }] },
        { id: "2", title: "Mechanical Engineering", date: "Yesterday", preview: "Tell me about the Mechanical dept", messages: [{ role: "assistant", content: "VPTC offers a flagship Diploma in Mechanical Engineering..." }] },
        { id: "3", title: "Admission 2026", date: "Jan 25", preview: "How do I apply for 1st year?", messages: [{ role: "assistant", content: "Admissions are open! You need..." }] },
        { id: "4", title: "Bus Routes", date: "Jan 24", preview: "Is there a bus from Polur?", messages: [{ role: "assistant", content: "Yes, we have 40km radius transport..." }] },
    ]);

    // Voice Input State
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    // AbortController for stopping generation
    const abortControllerRef = useRef<AbortController | null>(null);

    // Profile Dropdown Ref for click-outside detection
    const profileDropdownRef = useRef<HTMLDivElement>(null);

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
            // Get user data from localStorage
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setUserEmail(user.full_name || user.email || 'user@example.com');
                } catch (e) {
                    // Fallback to user_email if parse fails
                    const email = localStorage.getItem('user_email') || 'user@example.com';
                    setUserEmail(email);
                }
            } else {
                // Fallback to user_email
                const email = localStorage.getItem('user_email') || 'user@example.com';
                setUserEmail(email);
            }
        }
    }, [isGuest]);

    const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setIsUserScrolledUp(!isNearBottom);
        }
    };

    // Auto-scroll to bottom
    const scrollToBottom = (force = false) => {
        if (!isUserScrolledUp || force) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages, displayedText]);

    useEffect(() => {
        if (showSignupPrompt) {
            setShowModal(true);
        }
    }, [showSignupPrompt]);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setShowProfileDropdown(false);
            }
        };

        if (showProfileDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileDropdown]);

    // Typing animation effect for AI responses
    useEffect(() => {
        if (typingMessageIndex === null) return;

        const message = messages[typingMessageIndex];
        if (!message || message.role !== "assistant" || !message.isTyping) return;

        const fullText = message.content;
        let currentIndex = 0;

        // Clear displayed text when starting new message
        setDisplayedText("");

        const typingInterval = setInterval(() => {
            if (currentIndex < fullText.length) {
                // Type 2-4 characters at a time for smoother effect
                const charsToAdd = Math.min(3, fullText.length - currentIndex);
                setDisplayedText(fullText.substring(0, currentIndex + charsToAdd));
                currentIndex += charsToAdd;
            } else {
                // Typing complete - mark message as no longer typing
                clearInterval(typingInterval);
                setMessages(prev => prev.map((msg, idx) =>
                    idx === typingMessageIndex ? { ...msg, isTyping: false } : msg
                ));
                setTypingMessageIndex(null);
            }
        }, 30); // Faster for smoother effect

        return () => clearInterval(typingInterval);
    }, [typingMessageIndex, messages]);

    // Auto-save conversation when messages change
    useEffect(() => {
        if (messages.length > 1) { // More than just the initial message
            const currentConv = conversations.find(c => c.id === currentChatId);
            if (currentConv) {
                // Update existing conversation
                const firstUserMsg = messages.find(m => m.role === "user");
                const title = firstUserMsg ? firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? "..." : "") : "New Chat";
                const lastMsg = messages[messages.length - 1];
                const preview = lastMsg.content.slice(0, 50) + (lastMsg.content.length > 50 ? "..." : "");

                setConversations(prev => prev.map(conv =>
                    conv.id === currentChatId
                        ? { ...conv, title, preview, messages, date: new Date().toLocaleDateString() }
                        : conv
                ));
            }
        }
    }, [messages, currentChatId]);

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
            abortControllerRef.current = new AbortController();

            // All users (guests and logged-in) get REAL AI responses!
            const response = await api.post("/chat/message", 
                { message: userMsg },
                { signal: abortControllerRef.current.signal }
            );
            const aiResponse = response.data;

            const newMessage = {
                role: "assistant" as const,
                content: aiResponse.answer,
                sources: aiResponse.sources,
                followupQuestions: aiResponse.followup_questions,
                isTyping: true
            };

            setMessages((prev) => [...prev, newMessage]);

            // Start typing animation for the new message
            setTimeout(() => {
                setTypingMessageIndex(messages.length + 1); // +1 because we added user message earlier
            }, 100);

            // Track guest conversations
            if (isGuest) {
                incrementConversation();
            }
        } catch (error: any) {
            if (error?.name === 'CanceledError') {
                // Request was successfully aborted
                setLoading(false);
                return;
            }
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: "Sorry, I'm having trouble right now. Please try again or sign up for full access."
            }]);
        } finally {
            setLoading(false);
            abortControllerRef.current = null;
        }
    };

    const handleStopGeneration = () => {
        if (loading && abortControllerRef.current) {
            // Stop API request
            abortControllerRef.current.abort();
            setLoading(false);
        } else if (typingMessageIndex !== null) {
            // Stop typing animation
            setMessages(prev => prev.map((msg, idx) =>
                idx === typingMessageIndex ? { ...msg, content: displayedText, isTyping: false } : msg
            ));
            setTypingMessageIndex(null);
        }
    };

    const handleRegenerate = async (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        
        // Find last user message
        const messagesCopy = [...messages];
        const lastUserMsgIdx = messagesCopy.reverse().findIndex(m => m.role === "user");
        if (lastUserMsgIdx === -1) return;
        
        const trueIdx = messages.length - 1 - lastUserMsgIdx;
        const userMsg = messages[trueIdx].content;
        
        // Truncate messages back to the last user message
        const newHistory = messages.slice(0, trueIdx);
        setMessages(newHistory);
        
        // Let react update state queue, then run send
        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
        sendMessage(fakeEvent, userMsg);
    };

    const handleEditUserMessage = (idx: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const msgToEdit = messages[idx].content;
        
        // Truncate message history up to this point
        setMessages(messages.slice(0, idx));
        
        // Put the message back in the input box so user can edit and send
        setInput(msgToEdit);
    };

    const handleFeedback = async (messageIndex: number, rating: number) => {
        try {
            // Update UI immediately
            setMessages(prev => prev.map((msg, idx) =>
                idx === messageIndex ? { ...msg, rating } : msg
            ));

            // Send to backend
            await api.post('/feedback/', {
                message_id: `msg_${Date.now()}_${messageIndex}`,
                rating,
            });
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        }
    };

    const handleSaveChat = async () => {
        if (messages.length <= 1) return; // Don't save empty chats
        try {
            await api.post('/history/save', messages);
            alert('Chat saved to history!');
        } catch (error) {
            console.error('Failed to save chat:', error);
            alert('Failed to save chat.');
        }
    };

    const loadChatFromHistory = (historyMessages: any[]) => {
        setMessages(historyMessages);
    };

    // New Chat Handler
    const handleNewChat = () => {
        const newId = "chat_" + Date.now();
        const newConversation: Conversation = {
            id: newId,
            title: "New Chat",
            date: new Date().toLocaleDateString(),
            preview: "Start a conversation...",
            messages: [{ role: "assistant", content: "Hello! I am your Vignesh Polytechnic College (VPTC) AI Advisor. Ask me anything about our Diploma courses, admissions, or campus facilities." }]
        };

        setConversations(prev => [newConversation, ...prev]);
        setCurrentChatId(newId);
        setMessages(newConversation.messages);
        setInput("");
    };

    // Load conversation
    const handleLoadConversation = (id: string) => {
        const conversation = conversations.find(c => c.id === id);
        if (conversation) {
            setCurrentChatId(id);
            setMessages(conversation.messages);
        }
    };

    // Delete conversation
    const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setConversations(prev => prev.filter(conv => conv.id !== id));
        if (currentChatId === id) {
            handleNewChat();
        }
    };

    // Voice Input Handler
    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice input not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        if (isListening) {
            // Stop listening
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        // Start listening
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);

            // Provide helpful error messages
            if (event.error === 'not-allowed') {
                alert('Microphone access denied. Please:\n\n1. Click the lock icon in your browser address bar\n2. Allow microphone permission\n3. Refresh the page and try again');
            } else if (event.error === 'no-speech') {
                alert('No speech detected. Please try again and speak clearly.');
            } else if (event.error === 'audio-capture') {
                alert('No microphone found. Please check your microphone connection.');
            } else if (event.error === 'network') {
                alert('Network error. Please check your internet connection.');
            } else {
                alert('Could not recognize speech. Please try again.');
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };


    return (
        <div className="flex h-[100dvh] bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Sidebar - Fixed with left transition */}
            <div className={`fixed top-0 ${sidebarOpen ? 'left-0' : '-left-64'} w-64 h-full bg-[#efebe9] dark:bg-[#2d1b15] text-[#3e2723] dark:text-[#ffcc80] transition-all duration-300 ease-in-out flex flex-col z-50 shadow-2xl`}>
                {/* Sidebar Header */}
                <div className="p-4 border-b border-[#d7ccc8] dark:border-[#4e342e]">
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#d7ccc8] hover:bg-[#bcaaa4] dark:bg-[#4e342e] dark:hover:bg-[#5d4037] rounded-lg transition-colors font-medium text-[#3e2723] dark:text-[#ffcc80]"
                    >
                        <Plus className="w-5 h-5" />
                        New Chat
                    </button>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-[#bcaaa4] dark:scrollbar-thumb-[#5d4037] scrollbar-track-[#efebe9] dark:scrollbar-track-[#3e2723]">
                    {conversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => handleLoadConversation(conv.id)}
                            className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${currentChatId === conv.id
                                ? "bg-[#d7ccc8] dark:bg-[#4e342e]"
                                : "hover:bg-[#d7ccc8]/70 dark:hover:bg-[#4e342e]/50"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-[#5d4037] dark:text-[#ffcc80]/60" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="text-sm font-medium text-[#3e2723] dark:text-[#ffcc80] truncate">
                                            {conv.title}
                                        </h4>
                                        <button
                                            onClick={(e) => handleDeleteConversation(conv.id, e)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#bcaaa4] dark:hover:bg-[#5d4037] rounded transition-opacity"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-[#5d4037] dark:text-[#ffcc80]/60 hover:text-red-600 dark:hover:text-red-400" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-[#5d4037]/80 dark:text-[#ffcc80]/70 truncate mt-1">
                                        {conv.preview}
                                    </p>
                                    <p className="text-xs text-[#5d4037]/60 dark:text-[#ffcc80]/50 mt-1">
                                        {conv.date}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-[#d7ccc8] dark:border-[#4e342e] space-y-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#3e2723] dark:text-[#ffcc80] hover:bg-[#d7ccc8] dark:hover:bg-[#4e342e] rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#3e2723] dark:text-[#ffcc80] hover:bg-[#d7ccc8] dark:hover:bg-[#4e342e] rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Backdrop Overlay - Click to close sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Chat Area */}
            <div className="flex flex-col flex-1 h-[100dvh] bg-gradient-to-br from-[#ffffff] via-[#fff8e1] to-[#ffe0b2] dark:from-[#1a100e] dark:via-[#2d1b15] dark:to-[#3e2723] overflow-hidden relative">
                {/* Signup Prompt Modal */}
                <SignupPrompt
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    conversationsUsed={guestLimit}
                    totalLimit={guestLimit}
                />

                <ChatHistoryModal
                    isOpen={showHistoryModal}
                    onClose={() => setShowHistoryModal(false)}
                    onLoadChat={loadChatFromHistory}
                />

                {/* Header - Floating Elements */}
                <header className="absolute top-0 w-full z-10 p-4 flex justify-between items-start pointer-events-none">
                    {/* Left Actions - always vertical column */}
                    <div className="flex flex-col items-start gap-2 pointer-events-auto">
                        {/* Sidebar Toggle */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2.5 bg-white/60 hover:bg-white/90 dark:bg-black/40 dark:hover:bg-black/70 backdrop-blur-md text-gray-800 dark:text-gray-200 rounded-full transition-all shadow-sm flex items-center gap-2 border border-gray-200/50 dark:border-gray-700/50"
                            title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        {/* New Chat Button */}
                        <button
                            onClick={handleNewChat}
                            className="p-2.5 bg-white/60 hover:bg-white/90 dark:bg-black/40 dark:hover:bg-black/70 backdrop-blur-md text-gray-800 dark:text-gray-200 rounded-full transition-all shadow-sm flex items-center gap-2 border border-gray-200/50 dark:border-gray-700/50"
                            title="New Chat"
                        >
                            <Plus className="w-5 h-5" />
                        </button>

                        {/* Logo & Title - Floating Badge, desktop only */}
                        <div className="hidden md:flex items-center gap-3 px-2 py-1.5 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            <Link href="/" className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                                <Image
                                    src="/logo.png"
                                    alt="VPTC Logo"
                                    fill
                                    className="object-cover"
                                />
                            </Link>
                            <div className="pr-3">
                                <Link href="/" className="hover:opacity-80 transition-opacity">
                                    <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100">Vignesh Polytechnic AI</h1>
                                </Link>
                                {isGuest && remaining > 0 && (
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-0.5">
                                        {remaining} free chats remaining
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1.5 p-1.5 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-full shadow-sm border border-gray-200/50 dark:border-gray-700/50 pointer-events-auto">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        >
                            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-600"></div>

                        {/* User Profile Button */}
                        <div className="relative" ref={profileDropdownRef}>
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                {isGuest ? (
                                    <UserCircle className="w-6 h-6 text-gray-500" />
                                ) : (
                                    <div className="w-7 h-7 rounded-full overflow-hidden">
                                        {profilePic ? (
                                            <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-r from-[#8B6F47] to-[#6D563C] text-white flex items-center justify-center text-xs font-bold">
                                                {(userEmail ? userEmail.charAt(0).toUpperCase() : 'U')}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <span className="text-sm hidden md:inline font-medium text-gray-700 dark:text-gray-200">
                                    {isGuest ? 'Guest' : (userEmail?.split('@')[0] || 'User')}
                                </span>
                                <ChevronDown className="w-3 h-3 opacity-70" />
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
                <div 
                    ref={chatContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto px-4 pt-4"
                >
                    <div className="max-w-4xl mx-auto space-y-3">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn py-2`}>
                                <div className={`flex gap-4 max-w-full ${msg.role === "user" ? "flex-row-reverse" : ""} group w-full`}>
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${msg.role === "user" ? "" : "bg-transparent"
                                        }`}>
                                        {msg.role === "user" ? (
                                            profilePic ? (
                                                <img src={profilePic} alt="You" className="w-full h-full object-cover rounded-full" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B6F47] to-[#6D563C] text-white flex items-center justify-center">
                                                    <User className="w-5 h-5" />
                                                </div>
                                            )
                                        ) : (
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                                <Image
                                                    src="/logo.png"
                                                    alt="AI"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Content */}
                                    {msg.role === "user" ? (
                                        // User message with bubble
                                        <div className="flex-1 text-right group/user">
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    onClick={(e) => handleEditUserMessage(idx, e)}
                                                    className="p-2 rounded-full text-gray-400 hover:text-[#8B6F47] dark:hover:text-[#FFCC80] hover:bg-white dark:hover:bg-gray-800 transition-colors opacity-0 group-hover/user:opacity-100 shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                                                    title="Edit message"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <div className="inline-block max-w-[70%] px-4 py-3 rounded-2xl bg-gradient-to-r from-[#8B6F47] to-[#6D563C] text-white shadow-sm border border-[#6D563C]/20">
                                                    <p className="whitespace-pre-wrap leading-relaxed text-base text-left">
                                                        {msg.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // AI message clean without bubble
                                        <div className="flex-1 w-full overflow-hidden">
                                            <div className="text-gray-900 dark:text-gray-100 max-w-none break-words">
                                                {msg.isTyping && idx === typingMessageIndex ? (
                                                    <p className="whitespace-pre-wrap leading-relaxed text-base mb-0">
                                                        {displayedText}
                                                        <span className="inline-block w-1.5 h-4 ml-1 bg-current animate-pulse align-middle"></span>
                                                    </p>
                                                ) : (
                                                    <ReactMarkdown 
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            code(props) {
                                                                const {children, className, node, ref, ...rest} = props;
                                                                const match = /language-(\w+)/.exec(className || '');
                                                                return match ? (
                                                                    <div className="relative group rounded-md overflow-hidden my-4 bg-[#1E1E1E]">
                                                                        <div className="flex items-center justify-between px-4 py-1.5 bg-gray-800 text-gray-200 text-xs font-mono">
                                                                            <span>{match[1]}</span>
                                                                            <button 
                                                                                onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                                                                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white flex items-center gap-1"
                                                                            >
                                                                                <Copy className="w-3.5 h-3.5" />
                                                                                Copy
                                                                            </button>
                                                                        </div>
                                                                        <SyntaxHighlighter
                                                                            {...rest}
                                                                            style={vscDarkPlus as any}
                                                                            language={match[1]}
                                                                            PreTag="div"
                                                                            customStyle={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                                                                        >
                                                                            {String(children).replace(/\n$/, '')}
                                                                        </SyntaxHighlighter>
                                                                    </div>
                                                                ) : (
                                                                    <code {...rest} className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
                                                                        {children}
                                                                    </code>
                                                                );
                                                            },
                                                            p: ({children}) => <p className="leading-relaxed text-base mb-4 last:mb-0">{children}</p>,
                                                            a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{children}</a>,
                                                            ul: ({children}) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
                                                            ol: ({children}) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
                                                            li: ({children}) => <li className="leading-relaxed">{children}</li>,
                                                            table: ({children}) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">{children}</table></div>,
                                                            thead: ({children}) => <thead className="bg-gray-50 dark:bg-gray-800/50">{children}</thead>,
                                                            th: ({children}) => <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{children}</th>,
                                                            td: ({children}) => <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">{children}</td>,
                                                            h1: ({children}) => <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>,
                                                            h2: ({children}) => <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>,
                                                            h3: ({children}) => <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>,
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                )}
                                            </div>
                                            {!msg.isTyping && msg.sources && msg.sources.length > 0 && (
                                                (() => {
                                                    const filteredSources = msg.sources!.filter(s => s !== "General Knowledge");
                                                    if (filteredSources.length === 0) return null;
                                                    return (
                                                        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                                            <span className="font-medium">Sources:</span> {filteredSources.join(", ")}
                                                        </div>
                                                    );
                                                })()
                                            )}

                                            {/* Follow-up Questions */}
                                            {!msg.isTyping && msg.role === "assistant" && msg.followupQuestions && msg.followupQuestions.length > 0 && (
                                                <div className="mt-4 space-y-2">
                                                    <div className="flex flex-wrap gap-2">
                                                        {msg.followupQuestions.map((question, qIdx) => (
                                                            <button
                                                                key={qIdx}
                                                                onClick={() => sendMessage({} as any, question)}
                                                                className="text-sm px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full transition-all border border-gray-200 dark:border-gray-700"
                                                            >
                                                                {question}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Feedback Buttons */}
                                            {msg.role === "assistant" && !msg.isTyping && idx !== typingMessageIndex && (
                                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50 dark:border-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(msg.content)}
                                                        className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                        title="Copy response"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    {idx === messages.length - 1 && (
                                                        <button
                                                            onClick={handleRegenerate}
                                                            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                            title="Regenerate response"
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                                                    <button
                                                        onClick={() => handleFeedback(idx, 1)}
                                                        className={`p-1 rounded transition-colors ${msg.rating === 1
                                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                            }`}
                                                        title="Helpful"
                                                    >
                                                        <ThumbsUp className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleFeedback(idx, -1)}
                                                        className={`p-1 rounded transition-colors ${msg.rating === -1
                                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                            }`}
                                                        title="Not helpful"
                                                    >
                                                        <ThumbsDown className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Starter Prompts - Only show if no user messages yet */}
                        {messages.length === 1 && !loading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 animate-fadeIn max-w-2xl mx-auto pt-6">
                                {[
                                    { title: "Courses", prompt: "What diploma courses do you offer?", icon: <Sparkles className="w-5 h-5 text-yellow-500" /> },
                                    { title: "Admissions", prompt: "Explain the admission process & eligibility.", icon: <User className="w-5 h-5 text-blue-500" /> },
                                    { title: "Facilities", prompt: "Tell me about the college library and sports facilities.", icon: <RefreshCw className="w-5 h-5 text-green-500" /> },
                                    { title: "Placements", prompt: "What is the placement record of the college?", icon: <Check className="w-5 h-5 text-purple-500" /> },
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage({} as any, item.prompt)}
                                        className="flex flex-col text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-all hover:shadow-md hover:border-[#8B6F47] dark:hover:border-[#FFCC80] group"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            {item.icon}
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                                            {item.prompt}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}

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
                                            <div className="w-2 h-2 bg-[#8B6F47] dark:bg-[#FFCC80] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-[#8B6F47] dark:bg-[#FFCC80] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-[#8B6F47] dark:bg-[#FFCC80] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Floating Scroll Button */}
                {isUserScrolledUp && (
                    <button
                        onClick={() => {
                            setIsUserScrolledUp(false);
                            scrollToBottom(true);
                        }}
                        className="absolute bottom-24 right-8 p-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-xl border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all animate-bounce z-10"
                        title="Scroll to bottom"
                    >
                        <ChevronDown className="w-5 h-5" />
                    </button>
                )}

                {/* Input Area */}
                <div className="px-4 py-3 bg-transparent border-t border-gray-200/50 dark:border-gray-700/50 relative">
                    <form onSubmit={sendMessage} className="max-w-4xl mx-auto relative">
                        {/* Stop Generating Button */}
                        {(loading || typingMessageIndex !== null) && (
                            <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 z-10 w-full flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleStopGeneration}
                                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-full shadow-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors animate-fadeIn"
                                >
                                    <StopCircle className="w-4 h-4" />
                                    Stop generating
                                </button>
                            </div>
                        )}
                        <div className="flex gap-1 sm:gap-2 items-center bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 p-2">
                            <TextareaAutosize
                                minRows={1}
                                maxRows={5}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage(e as any);
                                    }
                                }}
                                placeholder="Ask about your college..."
                                className="flex-1 px-3 sm:px-4 py-3 bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base min-w-0 resize-none self-center scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                                disabled={loading || (isGuest && !canChat())}
                            />

                            {/* Voice Input Button */}
                            <button
                                type="button"
                                onClick={handleVoiceInput}
                                disabled={loading || (isGuest && !canChat())}
                                className={`p-2 sm:p-3 rounded-full transition-all flex-shrink-0 ${isListening
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                title={isListening ? "Listening... Click to stop" : "Voice input"}
                            >
                                {isListening ? (
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white"></div>
                                    </div>
                                ) : (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" />
                                    </svg>
                                )}
                            </button>

                            <button
                                type="submit"
                                disabled={loading || !input.trim() || (isGuest && !canChat())}
                                className="p-2 sm:p-3 bg-gradient-to-r from-[#8B6F47] to-[#6D563C] hover:from-[#6D563C] hover:to-[#5D4037] text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex-shrink-0"
                            >
                                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
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
        </div>
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
