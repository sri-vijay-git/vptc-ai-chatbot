"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Shield, GraduationCap, ChevronDown, User, LogOut } from "lucide-react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Departments", href: "/departments" },
    { name: "Admissions", href: "/admissions" },
    { name: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Mount check to prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Initial auth check & check on route change
    useEffect(() => {
        if (!isMounted) return; // Only check auth after mount to avoid hydration mismatch

        const checkAuth = () => {
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);
        };

        checkAuth();

        // Listen for storage events (e.g. login from another tab or component)
        window.addEventListener("storage", checkAuth);
        window.addEventListener("auth-change", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener("auth-change", checkAuth);
        };
    }, [pathname, isMounted]); // Re-run check when path changes (e.g. redirect from /login to /)

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setShowProfileMenu(false);
        window.location.href = "/"; // Force refresh to clear any state
    };

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const isChatPage = pathname?.startsWith("/chat");

    if (isChatPage && pathname === "/chat") return null;

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-white/95 dark:bg-[#1A100E]/95 backdrop-blur-md shadow-md py-2"
                : "bg-white dark:bg-[#1A100E] py-4"
                }`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center relative bg-transparent">
                {/* Mobile Menu Button (Left side) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-50"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? (
                        <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    ) : (
                        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    )}
                </button>

                {/* Logo - Centered on mobile, Left on desktop */}
                <Link href="/" className="absolute left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 flex items-center gap-2 z-40">
                    <Image
                        src="/logo.png"
                        alt="VPTC Logo"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <span className="hidden sm:inline font-bold text-lg text-gray-900 dark:text-white">
                        VPTC AI
                    </span>
                </Link>

                {/* Desktop Navigation - Centered */}
                <div className="hidden md:flex items-center gap-8 mx-auto">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href
                                ? "text-primary font-semibold"
                                : scrolled ? "text-gray-700 dark:text-gray-300" : "text-gray-800 dark:text-gray-200"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Actions - Always visible */}
                <div className="flex items-center gap-2 z-50">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle Theme"
                    >
                        {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
                    </button>

                    {isLoggedIn ? (
                        <>
                            {/* Student Dashboard Button */}
                            <Link
                                href="/student/dashboard"
                                className="flex items-center gap-1 px-2 sm:px-3 lg:px-4 py-2 rounded-full bg-[#8B6F47] hover:bg-[#6D563C] text-white transition-colors text-xs sm:text-sm font-medium whitespace-nowrap shadow-sm"
                            >
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>

                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-white dark:bg-[#2D1B15] border border-[#D7CCC8] dark:border-[#5D4037] shadow-sm hover:shadow-md transition-all"
                                >
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#8B6F47] to-[#6D563C] flex items-center justify-center text-white">
                                        <User className="w-4 h-4 sm:w-6 sm:h-6" />
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-[#5D4037] dark:text-[#BCAAA4] hidden sm:block" />
                                </button>

                                {/* Profile Dropdown */}
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-[fadeIn_0.2s_ease-out]">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            onClick={() => setShowProfileMenu(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            My Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="flex items-center gap-1 px-2 sm:px-3 lg:px-4 py-2 rounded-full bg-[#8B6F47] hover:bg-[#6D563C] text-white transition-colors text-xs sm:text-sm font-medium whitespace-nowrap shadow-sm"
                            >
                                <GraduationCap className="w-4 h-4" />
                                <span className="hidden sm:inline">Student</span>
                            </Link>

                            <Link
                                href="/admin/login"
                                className="flex items-center gap-1 px-2 sm:px-3 lg:px-4 py-2 rounded-full bg-[#8B6F47]/10 text-[#8B6F47] dark:bg-[#FFCC80]/10 dark:text-[#FFCC80] hover:bg-[#8B6F47]/20 dark:hover:bg-[#FFCC80]/20 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                            >
                                <Shield className="w-4 h-4" />
                                <span className="hidden sm:inline">Admin</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg md:hidden border-t border-gray-100 dark:border-gray-800"
                    >
                        <div className="flex flex-col p-4 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-lg font-medium px-4 py-2 rounded-lg ${pathname === link.href
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-700 dark:text-gray-300 active:bg-gray-100 dark:active:bg-gray-800"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <hr className="border-gray-100 dark:border-gray-800" />

                            <div className="flex items-center justify-between px-4">
                                <span className="text-gray-600 dark:text-gray-400">Theme</span>
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
                                >
                                    {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
                                </button>
                            </div>

                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-gradient-to-r from-[#8B6F47] to-[#6D563C] hover:from-[#6D563C] hover:to-[#5D4037] text-white transition-all shadow-md hover:shadow-lg"
                            >
                                <GraduationCap className="w-5 h-5" />
                                Student Login
                            </Link>

                            <Link
                                href="/admin/login"
                                className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Shield className="w-5 h-5" />
                                Admin Access
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
