"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isValidSession, setIsValidSession] = useState(false);
    const [sessionLoading, setSessionLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if the user landed here via a valid password reset link
        // Supabase sets the session automatically when the user clicks the link
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsValidSession(true);
            }
            setSessionLoading(false);
        };

        // Listen for the AUTH_CHANGE event from Supabase (fired after redirect)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY" && session) {
                setIsValidSession(true);
                setSessionLoading(false);
            }
        });

        checkSession();
        return () => subscription.unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({ password });

            if (updateError) {
                setError(updateError.message);
            } else {
                setSuccess(true);
                // Sign out and redirect to login after 3 seconds
                setTimeout(async () => {
                    await supabase.auth.signOut();
                    router.push("/login");
                }, 3000);
            }
        } catch (err: any) {
            setError("Something went wrong. Please try again.");
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
                        Reset Password
                    </h1>
                    <p className="text-[#5D4037] dark:text-[#BCAAA4]">
                        Enter your new password below.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-[#2D1B15] rounded-2xl shadow-xl p-8 border border-[#D7CCC8] dark:border-[#5D4037]">
                    {sessionLoading ? (
                        <div className="text-center py-8 text-[#5D4037] dark:text-[#BCAAA4]">
                            Verifying reset link...
                        </div>
                    ) : success ? (
                        /* Success State */
                        <div className="text-center py-4">
                            <div className="flex justify-center mb-4">
                                <CheckCircle className="w-16 h-16 text-green-500" />
                            </div>
                            <h2 className="text-xl font-semibold text-[#3E2723] dark:text-[#FFCC80] mb-3">
                                Password Updated!
                            </h2>
                            <p className="text-[#5D4037] dark:text-[#BCAAA4] text-sm">
                                Your password has been successfully changed. Redirecting you to login...
                            </p>
                        </div>
                    ) : !isValidSession ? (
                        /* Invalid / Expired Link */
                        <div className="text-center py-4">
                            <div className="flex justify-center mb-4">
                                <AlertCircle className="w-16 h-16 text-red-500" />
                            </div>
                            <h2 className="text-xl font-semibold text-[#3E2723] dark:text-[#FFCC80] mb-3">
                                Invalid or Expired Link
                            </h2>
                            <p className="text-[#5D4037] dark:text-[#BCAAA4] mb-6 text-sm leading-relaxed">
                                This password reset link is invalid or has expired. Please request a new one.
                            </p>
                            <Link
                                href="/forgot-password"
                                className="inline-flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-[#8B6F47] to-[#6D563C] text-white font-medium rounded-lg hover:opacity-90 transition-all text-sm"
                            >
                                Request New Link
                            </Link>
                        </div>
                    ) : (
                        /* Password Reset Form */
                        <>
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-[#3E2723] dark:text-[#FFCC80] mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47] dark:text-[#BCAAA4]" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6F47] dark:text-[#BCAAA4]" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-11 pr-12 py-3 rounded-lg border border-[#D7CCC8] dark:border-[#5D4037] bg-white dark:bg-[#3E2723] text-[#3E2723] dark:text-[#FFCC80] focus:ring-2 focus:ring-[#8B6F47] dark:focus:ring-[#FFCC80] outline-none transition-all"
                                            placeholder="Repeat your new password"
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
                                    {loading ? "Updating..." : "Update Password"}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
