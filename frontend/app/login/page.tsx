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
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
                        <Image
                            src="/logo.png"
                            alt="VPTC Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Student Portal
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Login to access your dashboard
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                    placeholder="student@vptc.edu"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-11 pr-12 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                                    className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                                />
                                <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-gray-900 font-semibold rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Logging in..." : "Login"}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                </div>

                {/* Footer Links */}
                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 font-semibold">
                        Sign Up
                    </Link>
                </div>

                <div className="mt-4 text-center">
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
