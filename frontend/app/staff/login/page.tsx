"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Briefcase, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const DEPARTMENTS = [
    "1st Year Staff (S&H)",
    "Computer Engineering (CSE)",
    "Electronics and Comm. Engineering (ECE)",
    "Electrical and Electronics Engineering (EEE)",
    "Mechanical Engineering",
    "Civil Engineering",
];

export default function StaffAuthPage() {
    const router = useRouter();

    const [mode, setMode] = useState<"login" | "signup">("login");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [signupData, setSignupData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirm_password: "",
        department: "",
        staff_setup_key: "",
    });

    const switchMode = (newMode: "login" | "signup") => {
        setError("");
        setSuccess("");
        setMode(newMode);
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
            const { access_token } = response.data;
            if (access_token) {
                localStorage.setItem("token", access_token);
                try {
                    const parts = access_token.split(".");
                    if (parts.length === 3) {
                        const payload = JSON.parse(atob(parts[1]));
                        const meta = payload.user_metadata || {};
                        const role = meta.role || payload.role || "student";
                        if (role !== "staff" && role !== "admin") {
                            localStorage.removeItem("token");
                            setError("This login is for Staff only. Please use the Student portal.");
                            setLoading(false);
                            return;
                        }
                        localStorage.setItem(
                            "user",
                            JSON.stringify({
                                email: payload.email || loginData.email,
                                full_name: meta.full_name || payload.email?.split("@")[0] || "Staff",
                                role,
                                id: payload.sub,
                            })
                        );
                    }
                } catch { }
            }
            window.dispatchEvent(new Event("auth-change"));
            router.push("/staff/dashboard");
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
        if (!signupData.department) {
            setError("Please select your department.");
            return;
        }
        if (!signupData.staff_setup_key) {
            setError("Staff secret registration key is required.");
            return;
        }
        setLoading(true);
        try {
            await api.post("/auth/signup", {
                full_name: signupData.full_name,
                email: signupData.email,
                password: signupData.password,
                role: "staff",
                staff_setup_key: signupData.staff_setup_key,
            });
            setSuccess("Account created! Please check your email to verify, then log in.");
            setSignupData({ full_name: "", email: "", password: "", confirm_password: "", department: "", staff_setup_key: "" });
            setTimeout(() => switchMode("login"), 2500);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isLogin = mode === "login";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B2838] to-[#0D1B2A] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo + Title */}
                <div className="text-center mb-6">
                    <div className="relative w-16 h-16 mx-auto mb-3">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-lg opacity-50 animate-pulse" />
                        <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-blue-400/30">
                            <Image src="/logo.png" alt="VPTC Logo" fill className="object-cover" />
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Briefcase className="w-5 h-5 text-blue-400" />
                        <h1 className="text-2xl font-bold text-white">Staff Portal</h1>
                    </div>
                    <p className="text-sm text-blue-300/70">Govt. Polytechnic College, Trivandrum</p>
                </div>

                {/* Tab switcher */}
                <div className="relative flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-6 shadow-inner">
                    <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 shadow-md ${isLogin ? "left-1" : "left-[calc(50%+3px)]"}`}
                    />
                    <button
                        onClick={() => switchMode("login")}
                        className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${isLogin ? "text-white" : "text-white/50"}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => switchMode("signup")}
                        className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-200 ${!isLogin ? "text-white" : "text-white/50"}`}
                    >
                        Register
                    </button>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/10 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div key="error" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="mb-4 p-3 bg-red-900/40 text-red-300 rounded-lg text-sm border border-red-700/50">
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div key="success" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="mb-4 p-3 bg-green-900/40 text-green-300 rounded-lg text-sm border border-green-700/50">
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {isLogin ? (
                            <motion.form key="login" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}
                                onSubmit={handleLogin} className="space-y-5">

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                                        <input type="email" required value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="staff@vptc.edu" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                                        <input type={showPassword ? "text" : "password"} required value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            className="w-full pl-11 pr-12 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Enter your password" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300">
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-blue-500/20">
                                    {loading ? "Logging in..." : "Login to Staff Portal"}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form key="signup" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.25 }}
                                onSubmit={handleSignup} className="space-y-4">

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                                        <input type="text" required value={signupData.full_name}
                                            onChange={(e) => setSignupData({ ...signupData, full_name: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Your full name" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Department</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 pointer-events-none" />
                                        <select required value={signupData.department}
                                            onChange={(e) => setSignupData({ ...signupData, department: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-white/10 bg-[#1B2838] text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
                                            <option value="">-- Select Your Department --</option>
                                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">
                                        <span className="flex items-center gap-1">
                                            <Shield className="w-4 h-4 text-red-400" />
                                            Staff Secret Registration Key
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                                        <input type="password" required value={signupData.staff_setup_key}
                                            onChange={(e) => setSignupData({ ...signupData, staff_setup_key: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-red-700/50 bg-red-900/10 text-white placeholder-red-300/30 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                            placeholder="Provided by the institution" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                                        <input type="email" required value={signupData.email}
                                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="staff@vptc.edu" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                                        <input type={showPassword ? "text" : "password"} required value={signupData.password}
                                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                            className="w-full pl-11 pr-12 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Min. 6 characters" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300">
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                                        <input type={showConfirmPassword ? "text" : "password"} required value={signupData.confirm_password}
                                            onChange={(e) => setSignupData({ ...signupData, confirm_password: e.target.value })}
                                            className="w-full pl-11 pr-12 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Re-enter your password" />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300">
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-blue-500/20">
                                    {loading ? "Registering..." : "Create Staff Account"}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Links */}
                <div className="mt-5 text-center space-y-2">
                    <Link href="/" className="block text-sm text-blue-300/60 hover:text-blue-200 transition-colors">
                        ← Back to Home
                    </Link>
                    <Link href="/login" className="block text-sm text-blue-300/60 hover:text-blue-200 transition-colors">
                        Student Login →
                    </Link>
                </div>
            </div>
        </div>
    );
}
