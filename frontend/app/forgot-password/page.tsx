"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/auth/forgot-password", { email });
            setSent(true);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Something went wrong. Please try again.");
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
                        Forgot Password?
                    </h1>
                    <p className="text-[#5D4037] dark:text-[#BCAAA4]">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-[#2D1B15] rounded-2xl shadow-xl p-8 border border-[#D7CCC8] dark:border-[#5D4037]">
                    {sent ? (
                        /* Success State */
                        <div className="text-center py-4">
                            <div className="flex justify-center mb-4">
                                <CheckCircle className="w-16 h-16 text-green-500" />
                            </div>
                            <h2 className="text-xl font-semibold text-[#3E2723] dark:text-[#FFCC80] mb-3">
                                Check your email!
                            </h2>
                            <p className="text-[#5D4037] dark:text-[#BCAAA4] mb-6 text-sm leading-relaxed">
                                We've sent a password reset link to <span className="font-semibold text-[#8B6F47] dark:text-[#FFCC80]">{email}</span>.
                                Please check your inbox and spam folder.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-[#8B6F47] hover:text-[#6D563C] dark:text-[#FFCC80] dark:hover:text-[#FFE0B2] font-medium text-sm transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        /* Form State */
                        <>
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                            placeholder="student@vptc.edu"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-[#8B6F47] to-[#6D563C] hover:from-[#6D563C] hover:to-[#5D4037] text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        </>
                    )}
                </div>

                {/* Footer Links */}
                {!sent && (
                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm text-[#5D4037] hover:text-[#3E2723] dark:text-[#BCAAA4] dark:hover:text-[#FFCC80] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
