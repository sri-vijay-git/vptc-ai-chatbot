"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import {
    Settings, User, Bell, Shield, Palette, MessageSquare,
    ChevronRight, Sun, Moon, Monitor, ArrowLeft, Check,
    Volume2, VolumeX, Globe, Trash2, Download, LogOut, Info
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Section = "appearance" | "chat" | "notifications" | "privacy" | "account" | "about";

const FONT_SIZE_OPTIONS = ["Small", "Medium", "Large"];
const LANGUAGE_OPTIONS = ["English", "Tamil", "Hindi"];

export default function SettingsPage() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    const [activeSection, setActiveSection] = useState<Section>("appearance");
    const [user, setUser] = useState<{ full_name?: string; email?: string; role?: string } | null>(null);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    // Appearance
    const [themeChoice, setThemeChoice] = useState<"light" | "dark" | "system">("system");
    const [fontSize, setFontSize] = useState("Medium");
    const [language, setLanguage] = useState("English");

    // Chat
    const [streamingEnabled, setStreamingEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [showTimestamps, setShowTimestamps] = useState(true);
    const [autoScroll, setAutoScroll] = useState(true);
    const [compactMode, setCompactMode] = useState(false);

    // Notifications
    const [emailNotif, setEmailNotif] = useState(false);
    const [pushNotif, setPushNotif] = useState(false);

    // Privacy
    const [saveHistory, setSaveHistory] = useState(true);
    const [shareUsage, setShareUsage] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try { setUser(JSON.parse(userStr)); } catch { }
        }
        const pic = localStorage.getItem("profilePic");
        if (pic) setProfilePic(pic);

        // Load saved settings
        const settings = JSON.parse(localStorage.getItem("vptc_settings") || "{}");
        if (settings.themeChoice) setThemeChoice(settings.themeChoice);
        if (settings.fontSize) setFontSize(settings.fontSize);
        if (settings.language) setLanguage(settings.language);
        if (typeof settings.streamingEnabled === "boolean") setStreamingEnabled(settings.streamingEnabled);
        if (typeof settings.soundEnabled === "boolean") setSoundEnabled(settings.soundEnabled);
        if (typeof settings.showTimestamps === "boolean") setShowTimestamps(settings.showTimestamps);
        if (typeof settings.autoScroll === "boolean") setAutoScroll(settings.autoScroll);
        if (typeof settings.compactMode === "boolean") setCompactMode(settings.compactMode);
        if (typeof settings.saveHistory === "boolean") setSaveHistory(settings.saveHistory);
        if (typeof settings.shareUsage === "boolean") setShareUsage(settings.shareUsage);
    }, []);

    const saveSettings = () => {
        const settings = {
            themeChoice, fontSize, language,
            streamingEnabled, soundEnabled, showTimestamps, autoScroll, compactMode,
            emailNotif, pushNotif, saveHistory, shareUsage
        };
        localStorage.setItem("vptc_settings", JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    const handleClearHistory = () => {
        if (confirm("Clear all chat history? This cannot be undone.")) {
            localStorage.removeItem("chatHistory");
            alert("Chat history cleared.");
        }
    };

    const sidebarItems: { id: Section; icon: React.ReactNode; label: string }[] = [
        { id: "appearance", icon: <Palette className="w-4 h-4" />, label: "Appearance" },
        { id: "chat", icon: <MessageSquare className="w-4 h-4" />, label: "Chat & AI" },
        { id: "notifications", icon: <Bell className="w-4 h-4" />, label: "Notifications" },
        { id: "privacy", icon: <Shield className="w-4 h-4" />, label: "Privacy & Data" },
        { id: "account", icon: <User className="w-4 h-4" />, label: "Account" },
        { id: "about", icon: <Info className="w-4 h-4" />, label: "About" },
    ];

    const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) => (
        <button
            onClick={() => onChange(!enabled)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${enabled ? "bg-[#8B6F47]" : "bg-gray-300 dark:bg-gray-600"}`}
        >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${enabled ? "translate-x-5" : "translate-x-0"}`} />
        </button>
    );

    const SettingRow = ({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
            <div className="flex-1 pr-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
            </div>
            {children}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
            {/* Top Bar */}
            <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <Settings className="w-5 h-5 text-[#8B6F47] dark:text-[#FFCC80]" />
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h1>
                <div className="ml-auto">
                    <button
                        onClick={saveSettings}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${saved
                            ? "bg-green-500 text-white"
                            : "bg-[#8B6F47] hover:bg-[#6D563C] text-white"
                            }`}
                    >
                        {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto flex gap-0 md:gap-6 p-0 md:p-6">
                {/* Sidebar */}
                <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-2 self-start sticky top-20 shadow-sm">
                    {/* User Card */}
                    <div className="flex flex-col items-center p-4 mb-2">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-[#8B6F47] flex items-center justify-center mb-2 ring-2 ring-[#8B6F47]/20">
                            {profilePic ? (
                                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white text-xl font-bold">
                                    {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                            )}
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-full">{user?.full_name || "User"}</p>
                        <p className="text-xs text-gray-400 truncate max-w-full">{user?.email || ""}</p>
                        <span className="mt-1 text-xs px-2 py-0.5 rounded-full bg-[#8B6F47]/10 text-[#8B6F47] dark:bg-[#FFCC80]/10 dark:text-[#FFCC80] font-medium capitalize">
                            {user?.role || "student"}
                        </span>
                    </div>

                    <div className="space-y-0.5">
                        {sidebarItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSection === item.id
                                    ? "bg-[#8B6F47]/10 text-[#8B6F47] dark:bg-[#FFCC80]/10 dark:text-[#FFCC80]"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                                {activeSection === item.id && <ChevronRight className="w-3 h-3 ml-auto" />}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Mobile nav */}
                <div className="md:hidden w-full overflow-x-auto flex gap-2 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeSection === item.id
                                ? "bg-[#8B6F47] text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-900 rounded-none md:rounded-2xl border-0 md:border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
                        >
                            {/* APPEARANCE */}
                            {activeSection === "appearance" && (
                                <div className="p-6">
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Appearance</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Customize how VPTC AI looks on your device.</p>

                                    {/* Theme */}
                                    <div className="mb-6">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">Theme</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {(["light", "dark", "system"] as const).map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => {
                                                        setThemeChoice(t);
                                                        if (t === "light" && theme === "dark") toggleTheme();
                                                        if (t === "dark" && theme === "light") toggleTheme();
                                                    }}
                                                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${themeChoice === t ? "border-[#8B6F47] dark:border-[#FFCC80] bg-[#8B6F47]/5 dark:bg-[#FFCC80]/5" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}
                                                >
                                                    {t === "light" && <Sun className="w-6 h-6 text-yellow-500" />}
                                                    {t === "dark" && <Moon className="w-6 h-6 text-indigo-400" />}
                                                    {t === "system" && <Monitor className="w-6 h-6 text-gray-500" />}
                                                    <span className="text-xs font-medium capitalize text-gray-700 dark:text-gray-300">{t}</span>
                                                    {themeChoice === t && <Check className="absolute top-2 right-2 w-3 h-3 text-[#8B6F47] dark:text-[#FFCC80]" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Font Size */}
                                    <div className="mb-6">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">Chat Font Size</p>
                                        <div className="flex gap-2">
                                            {FONT_SIZE_OPTIONS.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setFontSize(size)}
                                                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${fontSize === size ? "border-[#8B6F47] dark:border-[#FFCC80] bg-[#8B6F47]/10 text-[#8B6F47] dark:text-[#FFCC80]" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"}`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Language */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Globe className="w-4 h-4" /> Language</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {LANGUAGE_OPTIONS.map(lang => (
                                                <button
                                                    key={lang}
                                                    onClick={() => setLanguage(lang)}
                                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${language === lang ? "border-[#8B6F47] dark:border-[#FFCC80] bg-[#8B6F47]/10 text-[#8B6F47] dark:text-[#FFCC80]" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"}`}
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CHAT */}
                            {activeSection === "chat" && (
                                <div className="p-6">
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Chat & AI</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Control how the AI chat behaves.</p>
                                    <SettingRow label="Streaming Responses" description="Show AI response word-by-word as it generates">
                                        <Toggle enabled={streamingEnabled} onChange={setStreamingEnabled} />
                                    </SettingRow>
                                    <SettingRow label="Message Sound" description="Play a sound when a response is received">
                                        <Toggle enabled={soundEnabled} onChange={setSoundEnabled} />
                                    </SettingRow>
                                    <SettingRow label="Show Timestamps" description="Display the time next to each message">
                                        <Toggle enabled={showTimestamps} onChange={setShowTimestamps} />
                                    </SettingRow>
                                    <SettingRow label="Auto-scroll" description="Automatically scroll to the latest message">
                                        <Toggle enabled={autoScroll} onChange={setAutoScroll} />
                                    </SettingRow>
                                    <SettingRow label="Compact Mode" description="Reduce spacing between messages">
                                        <Toggle enabled={compactMode} onChange={setCompactMode} />
                                    </SettingRow>
                                </div>
                            )}

                            {/* NOTIFICATIONS */}
                            {activeSection === "notifications" && (
                                <div className="p-6">
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Notifications</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage how you get notified.</p>
                                    <SettingRow label="Email Notifications" description="Receive important updates via email">
                                        <Toggle enabled={emailNotif} onChange={setEmailNotif} />
                                    </SettingRow>
                                    <SettingRow label="Push Notifications" description="Browser push notifications for announcements">
                                        <Toggle enabled={pushNotif} onChange={setPushNotif} />
                                    </SettingRow>
                                </div>
                            )}

                            {/* PRIVACY */}
                            {activeSection === "privacy" && (
                                <div className="p-6">
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Privacy & Data</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Control your data and privacy preferences.</p>
                                    <SettingRow label="Save Chat History" description="Store your conversations for future reference">
                                        <Toggle enabled={saveHistory} onChange={setSaveHistory} />
                                    </SettingRow>
                                    <SettingRow label="Share Usage Analytics" description="Help improve VPTC AI by sharing anonymous usage data">
                                        <Toggle enabled={shareUsage} onChange={setShareUsage} />
                                    </SettingRow>
                                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                                        <button
                                            onClick={handleClearHistory}
                                            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Clear All Chat History
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ACCOUNT */}
                            {activeSection === "account" && (
                                <div className="p-6">
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Account</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage your account and profile.</p>

                                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-6">
                                        <div className="w-14 h-14 rounded-full overflow-hidden bg-[#8B6F47] flex items-center justify-center shrink-0">
                                            {profilePic ? (
                                                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white text-xl font-bold">{user?.full_name?.charAt(0)?.toUpperCase() || "U"}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 dark:text-white truncate">{user?.full_name || "User"}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-[#8B6F47]/10 text-[#8B6F47] dark:text-[#FFCC80] font-medium capitalize">{user?.role}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Link
                                            href="/profile"
                                            className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                <User className="w-4 h-4" /> Edit Profile
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </Link>

                                        <Link
                                            href="/forgot-password"
                                            className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                <Shield className="w-4 h-4" /> Change Password
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ABOUT */}
                            {activeSection === "about" && (
                                <div className="p-6">
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">About</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Information about VPTC AI Chatbot.</p>

                                    <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-[#FAF7F2] to-[#EFEBE9] dark:from-[#2D1B15] dark:to-[#3E2723] rounded-2xl mb-6">
                                        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 shadow-lg">
                                            <Image src="/logo.png" alt="VPTC" width={80} height={80} className="object-cover" />
                                        </div>
                                        <h3 className="text-lg font-bold text-[#3E2723] dark:text-[#FFCC80]">VPTC AI Chatbot</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Version 2.0.0</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 max-w-xs">
                                            AI-powered assistant for Vignesh Polytechnic College, Tiruvannamalai. Helping students with admissions, courses, fees, and more.
                                        </p>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-500">AI Model</span>
                                            <span className="font-medium text-gray-900 dark:text-white">Llama 3.3 70B (Groq)</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-500">College</span>
                                            <span className="font-medium text-gray-900 dark:text-white">VPTC, Tiruvannamalai</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-500">Contact</span>
                                            <span className="font-medium text-gray-900 dark:text-white">9488853917</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-gray-500">Website</span>
                                            <a href="https://vigneshpolytechniccollege.com" target="_blank" className="font-medium text-[#8B6F47] dark:text-[#FFCC80] hover:underline">vigneshpolytechniccollege.com</a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
