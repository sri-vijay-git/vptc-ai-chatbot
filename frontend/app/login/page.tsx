"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

// Google Icon SVG component
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

export default function AuthPage() {
    const router = useRouter();

    // "login" | "signup"
    const [mode, setMode] = useState<"login" | "signup">("login");

    // ---------- shared ----------
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // ---------- login form ----------
    const [loginData, setLoginData] = useState({ email: "", password: "" });

    // ---------- signup form ----------
    const [signupData, setSignupData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    // ========== HANDLERS ==========
    const switchMode = (newMode: "login" | "signup") => {
        setError("");
        setSuccess("");
        setMode(newMode);
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError("");
        try {
            const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
            const redirectTo = `${window.location.origin}/auth/callback`;
            const oauthUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}&access_type=offline`;
            window.location.href = oauthUrl;
        } catch (err) {
            setError("Failed to initiate Google sign-in. Please try again.");
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await api.post("/auth/login", {
                email: loginData.email,
                password: loginData.password,
            });
            const { access_token, user } = response.data;
            if (access_token) {
                localStorage.setItem("token", access_token);
                if (!user) {
                    try {
                        const parts = access_token.split(".");
                        if (parts.length === 3) {
                            const payload = JSON.parse(atob(parts[1]));
                            // Supabase stores full_name inside user_metadata
                            const meta = payload.user_metadata || {};
                            localStorage.setItem(
                                "user",
                                JSON.stringify({
                                    email: payload.email || loginData.email,
                                    full_name:
                                        meta.full_name ||
                                        payload.full_name ||
                                        payload.email?.split("@")[0] ||
                                        "Student",
                                    role: meta.role || payload.role || "student",
                                    id: payload.sub,
                                })
                            );
                        }
                    } catch {
                        localStorage.setItem(
                            "user",
                            JSON.stringify({
                                email: loginData.email,
                                full_name: loginData.email.split("@")[0],
                                role: "student",
                            })
                        );
                    }
                } else {
                    localStorage.setItem("user", JSON.stringify(user));
                }
            }
            window.dispatchEvent(new Event("auth-change"));
            window.dispatchEvent(new Event("storage"));
            router.push("/");
            router.refresh();
        } catch (err: any) {
            setError(err.response?.data?.detail || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (signupData.password !== signupData.confirm_password) {
            setError("Passwords do not match.");
            return;
        }
        if (signupData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        try {
            await api.post("/auth/signup", {
                full_name: signupData.full_name,
                email: signupData.email,
                password: signupData.password,
            });
            setSuccess("Account created! Please check your email to verify, then log in.");
            setSignupData({ full_name: "", email: "", password: "", confirm_password: "" });
            setTimeout(() => switchMode("login"), 2500);
        } catch (err: any) {
            setError(
                err.response?.data?.detail || "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========== UI ==========
    const isLogin = mode === "login";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#EFEBE9] to-[#F5F5DC] dark:from-[#1A100E] dark:via-[#2D1B15] dark:to-[#3E2723] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-300/10 to-orange-400/10 rounded-full blur-3xl animate-pulse" />
                <div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-6">
                    <div className="relative w-16 h-16 mx-auto mb-3">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FFCC80] to-[#FFB74D] rounded-full blur-lg opacity-50 animate-pulse" />
                        <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-[#8B6F47]/20 dark:border-[#FFCC80]/20">
                            <Image src="/logo.png" alt="VPTC Logo" fill className="object-cover" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-[#3E2723] dark:text-[#FFCC80]">Student Portal</h1>
                </div>

                {/* Sliding tab switcher */}
                <div className="relative flex bg-[#EFEBE9] dark:bg-[#2D1B15] rounded-2xl p-1 mb-6 shadow-inner">
                    {/* Animated bg pill */}
                    <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-r from-[#8B6F47] to-[#6D563C] shadow-md ${isLogin ? "left-1" : "left-[calc(50%+3px)]"}`}
                    />
                    <button
                        onClick={() => switchMode("login")}
                        className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${isLogin ? "text-white" : "text-[#5D4037] dark:text-[#BCAAA4]"}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => switchMode("signup")}
                        className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${!isLogin ? "text-white" : "text-[#5D4037] dark:text-[#BCAAA4]"}`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-[#2D1B15] rounded-2xl shadow-xl p-8 border border-[#D7CCC8] dark:border-[#5D4037] overflow-hidden">
                    {/* Error / Success */}
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800"
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm border border-green-200 dark:border-green-800"
                            >
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Sliding forms */}
                    <AnimatePresence mode="wait">
                        {isLogin ? (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.25 }}
                                onSubmit={handleLogin}
                                className="space-y-5"
                            >
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-[#3E2723] dark:text-[#FFCC80] mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47] dark:text-[#BCAAA4]" />
                                        <input
                                            type="email"
                                            required
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#D7CCC8] dark:border-[#5D4037] bg-white dark:bg-[#3E2723] text-[#3E2723] dark:text-[#FFCC80] focus:ring-2 focus:ring-[#8B6F47] dark:focus:ring-[#FFCC80] outline-none transition-all"
                                            placeholder="student@vptc.edu"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-[#3E2723] dark:text-[#FFCC80] mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47] dark:text-[#BCAAA4]" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            className="w-full pl-11 pr-12 py-3 rounded-lg border border-[#D7CCC8] dark:border-[#5D4037] bg-white dark:bg-[#3E2723] text-[#3E2723] dark:text-[#FFCC80] focus:ring-2 focus:ring-[#8B6F47] dark:focus:ring-[#FFCC80] outline-none transition-all"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B6F47] dark:text-[#BCAAA4] hover:text-[#6D563C] dark:hover:text-[#FFCC80]"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Forgot */}
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-[#D7CCC8] dark:border-[#5D4037] text-[#8B6F47] focus:ring-[#8B6F47]" />
                                        <span className="text-[#5D4037] dark:text-[#BCAAA4]">Remember me</span>
                                    </label>
                                    <Link href="/forgot-password" className="text-[#8B6F47] hover:text-[#6D563C] dark:text-[#FFCC80] dark:hover:text-[#FFE0B2] font-medium">
                                        Forgot password?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-[#8B6F47] to-[#6D563C] hover:from-[#6D563C] hover:to-[#5D4037] text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {loading ? "Logging in..." : "Login"}
                                    <ArrowRight className="w-5 h-5" />
                                </button>

                                {/* OR divider */}
                                <div className="flex items-center gap-3 my-1">
                                    <div className="flex-1 h-px bg-[#D7CCC8] dark:bg-[#5D4037]" />
                                    <span className="text-xs text-[#8B6F47] dark:text-[#BCAAA4] font-medium">OR</span>
                                    <div className="flex-1 h-px bg-[#D7CCC8] dark:bg-[#5D4037]" />
                                </div>

                                {/* Google Sign In */}
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="w-full py-3 bg-white dark:bg-[#3E2723] border border-[#D7CCC8] dark:border-[#5D4037] hover:bg-[#FFF8F0] dark:hover:bg-[#4E342E] text-[#3E2723] dark:text-[#FFCC80] font-semibold rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow hover:shadow-md"
                                >
                                    <GoogleIcon />
                                    Continue with Google
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="signup"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.25 }}
                                onSubmit={handleSignup}
                                className="space-y-4"
                            >
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-[#3E2723] dark:text-[#FFCC80] mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47] dark:text-[#BCAAA4]" />
                                        <input
                                            type="text"
                                            required
                                            value={signupData.full_name}
                                            onChange={(e) => setSignupData({ ...signupData, full_name: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#D7CCC8] dark:border-[#5D4037] bg-white dark:bg-[#3E2723] text-[#3E2723] dark:text-[#FFCC80] focus:ring-2 focus:ring-[#8B6F47] dark:focus:ring-[#FFCC80] outline-none transition-all"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-[#3E2723] dark:text-[#FFCC80] mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47] dark:text-[#BCAAA4]" />
                                        <input
                                            type="email"
                                            required
                                            value={signupData.email}
                                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#D7CCC8] dark:border-[#5D4037] bg-white dark:bg-[#3E2723] text-[#3E2723] dark:text-[#FFCC80] focus:ring-2 focus:ring-[#8B6F47] dark:focus:ring-[#FFCC80] outline-none transition-all"
                                            placeholder="student@vptc.edu"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-[#3E2723] dark:text-[#FFCC80] mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47] dark:text-[#BCAAA4]" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={signupData.password}
                                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                            className="w-full pl-11 pr-12 py-3 rounded-lg border border-[#D7CCC8] dark:border-[#5D4037] bg-white dark:bg-[#3E2723] text-[#3E2723] dark:text-[#FFCC80] focus:ring-2 focus:ring-[#8B6F47] dark:focus:ring-[#FFCC80] outline-none transition-all"
                                            placeholder="Min. 6 characters"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B6F47] dark:text-[#BCAAA4] hover:text-[#6D563C] dark:hover:text-[#FFCC80]"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-[#3E2723] dark:text-[#FFCC80] mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47] dark:text-[#BCAAA4]" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={signupData.confirm_password}
                                            onChange={(e) => setSignupData({ ...signupData, confirm_password: e.target.value })}
                                            className="w-full pl-11 pr-12 py-3 rounded-lg border border-[#D7CCC8] dark:border-[#5D4037] bg-white dark:bg-[#3E2723] text-[#3E2723] dark:text-[#FFCC80] focus:ring-2 focus:ring-[#8B6F47] dark:focus:ring-[#FFCC80] outline-none transition-all"
                                            placeholder="Re-enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B6F47] dark:text-[#BCAAA4] hover:text-[#6D563C] dark:hover:text-[#FFCC80]"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-[#8B6F47] to-[#6D563C] hover:from-[#6D563C] hover:to-[#5D4037] text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {loading ? "Creating account..." : "Create Account"}
                                    <ArrowRight className="w-5 h-5" />
                                </button>

                                {/* OR divider */}
                                <div className="flex items-center gap-3 my-1">
                                    <div className="flex-1 h-px bg-[#D7CCC8] dark:bg-[#5D4037]" />
                                    <span className="text-xs text-[#8B6F47] dark:text-[#BCAAA4] font-medium">OR</span>
                                    <div className="flex-1 h-px bg-[#D7CCC8] dark:bg-[#5D4037]" />
                                </div>

                                {/* Google Sign Up */}
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="w-full py-3 bg-white dark:bg-[#3E2723] border border-[#D7CCC8] dark:border-[#5D4037] hover:bg-[#FFF8F0] dark:hover:bg-[#4E342E] text-[#3E2723] dark:text-[#FFCC80] font-semibold rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow hover:shadow-md"
                                >
                                    <GoogleIcon />
                                    Sign up with Google
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                {/* Back to Home */}
                <div className="mt-5 text-center">
                    <Link href="/" className="text-sm text-[#5D4037] hover:text-[#3E2723] dark:text-[#BCAAA4] dark:hover:text-[#FFCC80]">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
