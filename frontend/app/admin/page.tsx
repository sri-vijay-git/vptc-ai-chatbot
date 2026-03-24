"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Shield, Users, Activity, MessageSquare, TrendingUp, LogOut, BarChart3, Clock } from "lucide-react";

interface Analytics {
    total_students: number;
    active_today: number;
    queries_processed: number;
    popular_topics: { topic: string; count: number }[];
    system_health: string;
}

interface Interaction {
    time: string;
    user: string;
    query: string;
    status: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch analytics
            const analyticsResponse = await api.get("/admin/analytics/dashboard");
            setAnalytics(analyticsResponse.data);

            // Fetch recent interactions
            const interactionsResponse = await api.get("/admin/analytics/interactions");
            setInteractions(interactionsResponse.data);

            setLoading(false);
        } catch (err: any) {
            setError("Failed to load dashboard data. Please ensure you have admin access.");
            setLoading(false);
            // Redirect to login if unauthorized
            if (err.response?.status === 401 || err.response?.status === 403) {
                router.push("/admin");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-red-300 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#1e3a5f] to-[#0f2744] p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] rounded-lg shadow-md">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#0a1628]">Admin Dashboard</h1>
                            <p className="text-[#1e3a5f] text-sm">VPTC AI Chatbot Analytics</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Analytics Cards */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Students */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Users className="w-6 h-6 text-[#2563eb]" />
                            </div>
                        </div>
                        <h3 className="text-[#1e3a5f] text-sm font-medium mb-1">Total Students</h3>
                        <p className="text-3xl font-bold text-[#0a1628]">{analytics?.total_students}</p>
                    </div>

                    {/* Active Today */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <Activity className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-[#1e3a5f] text-sm font-medium mb-1">Active Today</h3>
                        <p className="text-3xl font-bold text-[#0a1628]">{analytics?.active_today}</p>
                    </div>

                    {/* Queries Processed */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <MessageSquare className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-[#1e3a5f] text-sm font-medium mb-1">Queries Processed</h3>
                        <p className="text-3xl font-bold text-[#0a1628]">{analytics?.queries_processed}</p>
                    </div>

                    {/* System Health */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-50 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                        <h3 className="text-[#1e3a5f] text-sm font-medium mb-1">System Health</h3>
                        <p className="text-lg font-semibold text-[#0a1628]">{analytics?.system_health}</p>
                    </div>
                </div>
            </div>

            {/* Popular Topics */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                    <div className="flex items-center gap-3 mb-6">
                        <BarChart3 className="w-5 h-5 text-[#2563eb]" />
                        <h2 className="text-xl font-bold text-[#0a1628]">Popular Topics</h2>
                    </div>
                    <div className="space-y-4">
                        {analytics?.popular_topics.map((topic, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <span className="text-[#1e3a5f] font-medium">{topic.topic}</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-48 bg-blue-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] h-full rounded-full"
                                            style={{ width: `${(topic.count / 120) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-[#0a1628] font-semibold w-12 text-right">{topic.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Interactions */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="w-5 h-5 text-[#2563eb]" />
                        <h2 className="text-xl font-bold text-[#0a1628]">Recent Interactions</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-blue-100">
                                    <th className="text-left py-3 px-4 text-[#1e3a5f] font-semibold">Time</th>
                                    <th className="text-left py-3 px-4 text-[#1e3a5f] font-semibold">User</th>
                                    <th className="text-left py-3 px-4 text-[#1e3a5f] font-semibold">Query</th>
                                    <th className="text-left py-3 px-4 text-[#1e3a5f] font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {interactions.map((interaction, idx) => (
                                    <tr key={idx} className="border-b border-blue-50 hover:bg-blue-50 transition-colors">
                                        <td className="py-3 px-4 text-[#1e3a5f]">{interaction.time}</td>
                                        <td className="py-3 px-4 text-[#0a1628] font-medium">{interaction.user}</td>
                                        <td className="py-3 px-4 text-[#1e3a5f]">{interaction.query}</td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${interaction.status === "Resolved"
                                                        ? "bg-green-100 text-green-700 border border-green-300"
                                                        : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                                    }`}
                                            >
                                                {interaction.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
