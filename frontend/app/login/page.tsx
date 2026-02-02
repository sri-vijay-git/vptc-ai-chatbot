"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Backend expects JSON with email and password fields
            const response = await api.post("/auth/login", {
                email: formData.email,
                password: formData.password
            });

            const { access_token, user } = response.data;

            if (access_token) {
                localStorage.setItem("token", access_token);

                // Decode JWT to extract user data if user object not provided
                if (!user) {
                    try {
                        const tokenParts = access_token.split('.');
                        if (tokenParts.length === 3) {
                            const payload = JSON.parse(atob(tokenParts[1]));
                            const userData = {
                                email: payload.email || formData.email,
                                full_name: payload.full_name || payload.email?.split('@')[0] || "Student",
                                role: payload.role || "student",
                                id: payload.sub
                            };
                            localStorage.setItem("user", JSON.stringify(userData));
                        }
                    } catch (decodeError) {
                        console.error("Failed to decode token:", decodeError);
                        // Fallback: save email from form
                        localStorage.setItem("user", JSON.stringify({
                            email: formData.email,
                            full_name: formData.email.split('@')[0],
                            role: "student"
                        }));
                    }
                } else {
                    localStorage.setItem("user", JSON.stringify(user));
                }
            }

            // Dispatch custom event to notify components in the SAME window
            window.dispatchEvent(new Event("auth-change"));

            // Also dispatch storage event for consistency (though it mainly affects other tabs)
            window.dispatchEvent(new Event("storage"));

            router.push("/");
            router.refresh();
        } catch (err: any) {
            console.error("Login failed", err);
            setError(err.response?.data?.detail || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#EFEBE9] to-[#F5F5DC] dark:from-[#1A100E] dark:via-[#2D1B15] dark:to-[#3E2723] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-300/10 to-orange-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FFCC80] to-[#FFB74D] rounded-full blur-lg opacity-50 animate-pulse" />
                        <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-[#8B6F47]/20 dark:border-[#FFCC80]/20">
                            <Image
                                src="/logo.png"
                                alt="VPTC Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-[#3E2723] dark:text-[#FFCC80] mb-2">
                        Student Portal
                    </h1>
                    <p className="text-[#5D4037] dark:text-[#BCAAA4]">
                        Login to access your dashboard
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-[#2D1B15] rounded-2xl shadow-xl p-8 border border-[#D7CCC8] dark:border-[#5D4037]">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-[#D7CCC8] dark:border-[#5D4037] text-[#8B6F47] focus:ring-[#8B6F47]"
                                />
                                <span className="text-[#5D4037] dark:text-[#BCAAA4]">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-[#8B6F47] hover:text-[#6D563C] dark:text-[#FFCC80] dark:hover:text-[#FFE0B2] font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-[#8B6F47] to-[#6D563C] hover:from-[#6D563C] hover:to-[#5D4037] text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {loading ? "Logging in..." : "Login"}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                </div>

                {/* Footer Links */}
                <div className="mt-6 text-center text-sm text-[#5D4037] dark:text-[#BCAAA4]">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-[#8B6F47] hover:text-[#6D563C] dark:text-[#FFCC80] dark:hover:text-[#FFE0B2] font-semibold">
                        Sign Up
                    </Link>
                </div>

                <div className="mt-4 text-center">
                    <Link href="/" className="text-sm text-[#5D4037] hover:text-[#3E2723] dark:text-[#BCAAA4] dark:hover:text-[#FFCC80]">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
