"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Shield } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/login", { email, password });
            const { access_token } = response.data;

            // Store token
            localStorage.setItem("token", access_token);

            // Verify admin role by trying to access admin endpoint
            try {
                await api.get("/admin/analytics/dashboard");
                // If successful, user is admin - redirect to dashboard
                router.push("/admin/dashboard");
            } catch (adminErr) {
                // Not an admin
                localStorage.removeItem("token");
                setError("Access denied. Admin credentials required.");
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#1e3a5f] to-[#0f2744]">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-blue-100">
                {/* Admin Badge */}
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] rounded-full shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-2 text-center text-[#0a1628]">Admin Portal</h2>
                <p className="text-center text-[#1e3a5f] mb-6">VPTC AI Chatbot Dashboard</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#0a1628] mb-2">Admin Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg text-[#0a1628] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-200"
                            placeholder="admin@vptc.edu.in"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#0a1628] mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-10 bg-blue-50 border-2 border-blue-200 rounded-lg text-[#0a1628] placeholder-gray-400 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-200"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1e3a5f] hover:text-[#2563eb]"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] text-white font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#3b82f6] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {loading ? "Authenticating..." : "Access Dashboard"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Authorized personnel only
                </p>
            </div>
        </div>
    );
}
