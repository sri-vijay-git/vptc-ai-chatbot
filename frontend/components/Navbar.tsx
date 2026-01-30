"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Shield, GraduationCap, ChevronDown } from "lucide-react";
import Image from "next/image";

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
    const isAdminPage = pathname?.startsWith("/admin");

    // Hide Navbar on specific pages if needed, but for now we keep it or handle via LayoutWrapper.
    // However, if this component is used inside LayoutWrapper which conditionally renders it, we don't need this check.
    // But keeping it robust:
    if (isChatPage && pathname === "/chat") return null; // Logic might be moved to LayoutWrapper, but safeguards are good.

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-white/95 dark:bg-[#1A100E]/95 backdrop-blur-md shadow-md py-2"
                : "bg-white dark:bg-[#1A100E] py-4"
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex justify-center items-center relative">
                {/* Desktop Navigation - Centered */}
                <div className="hidden md:flex items-center gap-8">
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


                {/* Right Actions - Fixed positioned in corner */}
                <div className="hidden md:flex items-center gap-2 lg:gap-3 fixed top-4 right-4 lg:right-6 z-50">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors backdrop-blur-sm"
                        aria-label="Toggle Theme"
                    >
                        {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
                    </button>

                    <Link
                        href="/login"
                        className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors text-sm font-medium whitespace-nowrap backdrop-blur-sm"
                    >
                        <GraduationCap className="w-4 h-4" />
                        <span className="hidden lg:inline">Student Portal</span>
                        <span className="lg:hidden">Student</span>
                    </Link>

                    <Link
                        href="/admin/login"
                        className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full bg-[#8B6F47]/10 text-[#8B6F47] dark:bg-[#FFCC80]/10 dark:text-[#FFCC80] hover:bg-[#8B6F47]/20 dark:hover:bg-[#FFCC80]/20 transition-colors text-sm font-medium whitespace-nowrap backdrop-blur-sm"
                    >
                        <Shield className="w-4 h-4" />
                        <span className="hidden lg:inline">Admin Login</span>
                        <span className="lg:hidden">Admin</span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-gray-700 dark:text-white"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
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
                                className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
                            >
                                <GraduationCap className="w-5 h-5" />
                                Student Login
                            </Link>

                            <Link
                                href="/admin"
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
