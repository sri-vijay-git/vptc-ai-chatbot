"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Call backend authentication API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store admin session
                localStorage.setItem("adminAuth", "true");
                localStorage.setItem("adminToken", data.token);
                localStorage.setItem("adminEmail", email);

                // Redirect to admin dashboard
                router.push("/admin");
            } else {
                setError(data.message || "Invalid email or password");
                setLoading(false);
            }
        } catch (err) {
            setError("Connection error. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D1B15] via-[#3E2723] to-[#1A100E] dark:from-[#0D0706] dark:to-[#1A100E] px-4 relative overflow-hidden">
            {/* Decorative background elements - More intense for admin */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/15 to-orange-500/15 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-600/15 to-amber-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="relative w-20 h-20">
                            {/* Premium glow effect for admin */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FFCC80] to-[#FFB74D] rounded-full blur-xl opacity-60 animate-pulse" />
                            <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-2xl border-2 border-[#FFCC80]/30">
                                <Image src="/logo.png" alt="VPTC" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="w-6 h-6 text-[#FFCC80]" />
                        <h1 className="text-3xl font-bold text-[#FFCC80]">
                            Admin Portal
                        </h1>
                    </div>
                    <p className="text-[#BCAAA4]">
                        VPTC Management System
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-[#2D1B15] dark:bg-[#1A100E] rounded-2xl shadow-2xl border border-[#5D4037] dark:border-[#8B6F47]/30 p-8">
                    <h2 className="text-xl font-semibold text-[#FFCC80] mb-6">
                        Sign in to continue
                    </h2>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-[#FFCC80] mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-[#BCAAA4]" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@vptc.edu"
                                    className="w-full pl-10 pr-4 py-3 border border-[#5D4037] dark:border-[#8B6F47]/50 rounded-lg focus:ring-2 focus:ring-[#FFCC80] focus:border-transparent bg-[#3E2723] dark:bg-[#0D0706] text-[#FFCC80] placeholder-[#8B6F47]"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-[#FFCC80] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-[#BCAAA4]" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-12 py-3 border border-[#5D4037] dark:border-[#8B6F47]/50 rounded-lg focus:ring-2 focus:ring-[#FFCC80] focus:border-transparent bg-[#3E2723] dark:bg-[#0D0706] text-[#FFCC80] placeholder-[#8B6F47]"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-[#BCAAA4] hover:text-[#FFCC80]" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-[#BCAAA4] hover:text-[#FFCC80]" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-900/30 border border-red-800/50 text-red-300 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#FFCC80] to-[#FFB74D] hover:from-[#FFE0B2] hover:to-[#FFCC80] text-[#3E2723] font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-[#3E2723] border-t-transparent rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Forgot Password */}
                    <div className="mt-4 text-center">
                        <Link
                            href="/admin/forgot-password"
                            className="text-sm text-[#BCAAA4] hover:text-[#FFCC80] transition-colors"
                        >
                            Forgot your password?
                        </Link>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-[#BCAAA4] hover:text-[#FFCC80] transition-colors"
                        >
                            ← Back to Homepage
                        </Link>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-[#3E2723]/30 dark:bg-[#0D0706]/50 rounded-lg border border-[#8B6F47]/30">
                    <div className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-[#FFCC80] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-[#FFCC80] mb-1">
                                Secure Access
                            </p>
                            <p className="text-xs text-[#BCAAA4]">
                                This portal is for authorized VPTC administrators only. All login attempts are logged and monitored.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Text */}
                <p className="text-center text-sm text-[#8B6F47] mt-6">
                    Unauthorized access is prohibited and will be prosecuted.
                </p>
            </div>
        </div>
    );
}
