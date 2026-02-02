"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/auth/signup", {
                email,
                password,
                full_name: fullName,
                role: "student"
            });

            setSuccess(true);

            setSuccess(true);

            // Allow user to read the message, they can click link to go to login
            // or wait for redirect
            setTimeout(() => {
                router.push("/login"); // Optional: Remove if you want them to stay until checked
            }, 5000);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FAF7F2] via-[#EFEBE9] to-[#F5F5DC] dark:from-[#1A100E] dark:via-[#2D1B15] dark:to-[#3E2723]">
                <div className="w-full max-w-md p-8 bg-white dark:bg-[#2D1B15] rounded-lg shadow-lg text-center border border-[#D7CCC8] dark:border-[#5D4037]">
                    <div className="mb-4 text-green-600 text-5xl">✓</div>
                    <h2 className="text-2xl font-bold mb-4 text-[#3E2723] dark:text-[#FFCC80]">Account Created!</h2>
                    <p className="text-[#5D4037] dark:text-[#BCAAA4] mb-4">
                        Your account has been successfully created.
                    </p>
                    <div className="bg-[#EFEBE9] dark:bg-[#3E2723] border border-[#D7CCC8] dark:border-[#5D4037] rounded-lg p-4 mb-4">
                        <p className="text-sm text-[#3E2723] dark:text-[#FFCC80]">
                            📧 <strong>Check your inbox!</strong><br />
                            We have sent a verification link to <strong>{email}</strong>.<br />
                            Please click the link to verify your account and login.
                        </p>
                    </div>
                    <p className="text-[#5D4037] dark:text-[#BCAAA4]">Redirecting to login page...</p>
                </div>
            </div>
        );
    }

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
                    <h1 className="text-3xl font-bold text-[#3E2723] dark:text-[#FFCC80] mb-2">
                        Student Portal
                    </h1>
                    <p className="text-[#5D4037] dark:text-[#BCAAA4]">
                        Create your account to get started
                    </p>
                </div>

                {/* Signup Card */}
                <div className="bg-white dark:bg-[#2D1B15] rounded-2xl shadow-xl p-8 border border-[#D7CCC8] dark:border-[#5D4037]">
                    <h2 className="text-2xl font-bold mb-6 text-center text-[#3E2723] dark:text-[#FFCC80]">Create Account</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-5">
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
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#D7CCC8] dark:border-[#5D4037] bg-white dark:bg-[#3E2723] text-[#3E2723] dark:text-[#FFCC80] focus:ring-2 focus:ring-[#8B6F47] dark:focus:ring-[#FFCC80] outline-none transition-all"
                                    placeholder="student@vptc.edu.in"
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
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3 rounded-lg border border-[#D7CCC8] dark:border-[#5D4037] bg-white dark:bg-[#3E2723] text-[#3E2723] dark:text-[#FFCC80] focus:ring-2 focus:ring-[#8B6F47] dark:focus:ring-[#FFCC80] outline-none transition-all"
                                    placeholder="At least 6 characters"
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-[#8B6F47] to-[#6D563C] hover:from-[#6D563C] hover:to-[#5D4037] text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {loading ? "Creating account..." : (
                                <>
                                    Sign Up
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center text-sm text-[#5D4037] dark:text-[#BCAAA4]">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#8B6F47] hover:text-[#6D563C] dark:text-[#FFCC80] dark:hover:text-[#FFE0B2] font-semibold">
                            Login
                        </Link>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/" className="text-sm text-[#5D4037] hover:text-[#3E2723] dark:text-[#BCAAA4] dark:hover:text-[#FFCC80]">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
