"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, KeyRound, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";

export default function AdminForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [setupKey, setSetupKey] = useState("");
    
    const [showPassword, setShowPassword] = useState(false);
    const [showSetupKey, setShowSetupKey] = useState(false);
    
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            // Using the api utility which handles the base URL automatically
            const response = await api.post(`/admin/reset-password`, {
                email: email.toLowerCase().trim(),
                new_password: newPassword,
                setup_key: setupKey,
            });

            if (response.data.success) {
                setSuccess(true);
            } else {
                setError(response.data.message || "Failed to reset password.");
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || "Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D1B15] via-[#3E2723] to-[#1A100E] dark:from-[#0D0706] dark:to-[#1A100E] px-4 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/15 to-orange-500/15 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-600/15 to-amber-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="relative w-20 h-20">
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
                        Reset Administrator Password
                    </p>
                </div>

                {/* Reset Password Card */}
                <div className="bg-[#2D1B15] dark:bg-[#1A100E] rounded-2xl shadow-2xl border border-[#5D4037] dark:border-[#8B6F47]/30 p-8">
                    {success ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-semibold text-[#FFCC80] mb-2">Password Reset!</h2>
                            <p className="text-[#BCAAA4] mb-6 text-sm">
                                Your administrator password has been successfully updated.
                            </p>
                            <Link
                                href="/admin/login"
                                className="inline-flex w-full bg-gradient-to-r from-[#FFCC80] to-[#FFB74D] hover:from-[#FFE0B2] hover:to-[#FFCC80] text-[#3E2723] font-semibold py-3 px-4 rounded-lg transition-all items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <Lock className="w-5 h-5" />
                                Return to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-[#BCAAA4] mb-6 text-center">
                                To securely reset your password, you must provide the secret setup key configured on the server.
                            </p>

                            <form onSubmit={handleResetPassword} className="space-y-4">
                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-[#FFCC80] mb-1.5">
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
                                            className="w-full pl-10 pr-4 py-2.5 border border-[#5D4037] dark:border-[#8B6F47]/50 rounded-lg focus:ring-2 focus:ring-[#FFCC80] focus:border-transparent bg-[#3E2723] dark:bg-[#0D0706] text-[#FFCC80] placeholder-[#8B6F47]"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* New Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-[#FFCC80] mb-1.5">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-[#BCAAA4]" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            className="w-full pl-10 pr-12 py-2.5 border border-[#5D4037] dark:border-[#8B6F47]/50 rounded-lg focus:ring-2 focus:ring-[#FFCC80] focus:border-transparent bg-[#3E2723] dark:bg-[#0D0706] text-[#FFCC80] placeholder-[#8B6F47]"
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

                                {/* Setup Key Field */}
                                <div>
                                    <label className="block text-sm font-medium text-[#FFCC80] mb-1.5 flex justify-between">
                                        <span>Master Setup Key</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <KeyRound className="h-5 w-5 text-[#FFB74D]" />
                                        </div>
                                        <input
                                            type={showSetupKey ? "text" : "password"}
                                            value={setupKey}
                                            onChange={(e) => setSetupKey(e.target.value)}
                                            placeholder="Enter the secret setup key"
                                            className="w-full pl-10 pr-12 py-2.5 border border-[#5D4037] dark:border-[#8B6F47]/50 rounded-lg focus:ring-2 focus:ring-[#FFB74D] focus:border-transparent bg-[#3E2723] dark:bg-[#0D0706] text-[#FFB74D] placeholder-[#8B6F47]"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSetupKey(!showSetupKey)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showSetupKey ? (
                                                <EyeOff className="h-5 w-5 text-[#BCAAA4] hover:text-[#FFCC80]" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-[#BCAAA4] hover:text-[#FFCC80]" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-900/30 border border-red-800/50 text-red-300 px-4 py-3 rounded-lg text-sm flex items-center gap-2 mt-2">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#FFCC80] to-[#FFB74D] hover:from-[#FFE0B2] hover:to-[#FFCC80] text-[#3E2723] font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-4"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-[#3E2723] border-t-transparent rounded-full animate-spin" />
                                            Resetting...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5" />
                                            Reset Password
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    {/* Back to Login */}
                    {!success && (
                        <div className="mt-6 text-center">
                            <Link
                                href="/admin/login"
                                className="text-sm text-[#BCAAA4] hover:text-[#FFCC80] transition-colors"
                            >
                                ← Back to Login
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer Text */}
                <p className="text-center text-sm text-[#8B6F47] mt-6">
                    Authorized override portal. Access is logged.
                </p>
            </div>
        </div>
    );
}
