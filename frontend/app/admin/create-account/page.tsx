"use client";

import { useState } from "react";
import {
    Shield,
    UserPlus,
    Mail,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2,
    User,
    ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CreateAdminAccount() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [setupKey, setSetupKey] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSetupKey, setShowSetupKey] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!setupKey.trim()) {
            setError("Admin Setup Key is required.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/create-admin`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email.toLowerCase().trim(),
                        password,
                        full_name: fullName.trim(),
                        setup_key: setupKey.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(
                    `✅ Admin account created for ${email}! You can now log in at /admin/login.`
                );
                setFullName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setSetupKey("");
            } else {
                setError(data.detail || "Failed to create admin account.");
            }
        } catch (err) {
            setError("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D1B15] via-[#3E2723] to-[#1A100E] px-4 relative overflow-hidden py-12">
            {/* Decorative background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/15 to-orange-500/15 rounded-full blur-3xl animate-pulse" />
                <div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-600/15 to-amber-600/15 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-500/10 to-amber-400/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "2s" }}
                />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
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
                        <h1 className="text-3xl font-bold text-[#FFCC80]">Admin Portal</h1>
                    </div>
                    <p className="text-[#BCAAA4]">Create New Admin Account</p>
                </div>

                {/* Card */}
                <div className="bg-[#2D1B15] rounded-2xl shadow-2xl border border-[#5D4037] p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <UserPlus className="w-5 h-5 text-[#FFCC80]" />
                        <h2 className="text-xl font-semibold text-[#FFCC80]">
                            Create Admin Account
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-[#FFCC80] mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-[#BCAAA4]" />
                                </div>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="e.g. Dr. Rajesh Kumar"
                                    className="w-full pl-10 pr-4 py-3 border border-[#5D4037] rounded-lg focus:ring-2 focus:ring-[#FFCC80] focus:border-transparent bg-[#3E2723] text-[#FFCC80] placeholder-[#8B6F47] outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
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
                                    className="w-full pl-10 pr-4 py-3 border border-[#5D4037] rounded-lg focus:ring-2 focus:ring-[#FFCC80] focus:border-transparent bg-[#3E2723] text-[#FFCC80] placeholder-[#8B6F47] outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
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
                                    placeholder="Minimum 6 characters"
                                    className="w-full pl-10 pr-12 py-3 border border-[#5D4037] rounded-lg focus:ring-2 focus:ring-[#FFCC80] focus:border-transparent bg-[#3E2723] text-[#FFCC80] placeholder-[#8B6F47] outline-none transition-all"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-[#BCAAA4] hover:text-[#FFCC80] transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-[#BCAAA4] hover:text-[#FFCC80] transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-[#FFCC80] mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-[#BCAAA4]" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter password"
                                    className="w-full pl-10 pr-12 py-3 border border-[#5D4037] rounded-lg focus:ring-2 focus:ring-[#FFCC80] focus:border-transparent bg-[#3E2723] text-[#FFCC80] placeholder-[#8B6F47] outline-none transition-all"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-[#BCAAA4] hover:text-[#FFCC80] transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-[#BCAAA4] hover:text-[#FFCC80] transition-colors" />
                                    )}
                                </button>
                            </div>
                            {confirmPassword.length > 0 && (
                                <p
                                    className={`text-xs mt-1 ${password === confirmPassword
                                            ? "text-green-400"
                                            : "text-red-400"
                                        }`}
                                >
                                    {password === confirmPassword
                                        ? "✓ Passwords match"
                                        : "✗ Passwords do not match"}
                                </p>
                            )}
                        </div>

                        {/* Admin Setup Key */}
                        <div>
                            <label className="block text-sm font-medium text-[#FFCC80] mb-2">
                                Admin Setup Key
                                <span className="ml-2 text-xs text-[#BCAAA4] font-normal">
                                    (secret key from your .env file)
                                </span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-[#BCAAA4]" />
                                </div>
                                <input
                                    type={showSetupKey ? "text" : "password"}
                                    value={setupKey}
                                    onChange={(e) => setSetupKey(e.target.value)}
                                    placeholder="Enter the admin setup key"
                                    className="w-full pl-10 pr-12 py-3 border border-[#5D4037] rounded-lg focus:ring-2 focus:ring-[#FFCC80] focus:border-transparent bg-[#3E2723] text-[#FFCC80] placeholder-[#8B6F47] outline-none transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSetupKey(!showSetupKey)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showSetupKey ? (
                                        <EyeOff className="h-5 w-5 text-[#BCAAA4] hover:text-[#FFCC80] transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-[#BCAAA4] hover:text-[#FFCC80] transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-900/30 border border-red-800/50 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="bg-green-900/30 border border-green-800/50 text-green-300 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#FFCC80] to-[#FFB74D] hover:from-[#FFE0B2] hover:to-[#FFCC80] text-[#3E2723] font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-[#3E2723] border-t-transparent rounded-full animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Create Admin Account
                                </>
                            )}
                        </button>
                    </form>

                    {/* Already have account */}
                    <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-[#8B6F47]">Already have an account?</p>
                        <Link
                            href="/admin/login"
                            className="inline-flex items-center gap-1 text-sm text-[#BCAAA4] hover:text-[#FFCC80] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go to Admin Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
