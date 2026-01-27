"use client";

import { useState } from "react";
import { Users, FileText, TrendingUp, DollarSign, CheckCircle, Clock, XCircle, Settings, LogOut, Bell, Search, Download, Filter, MoreVertical, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    // Mock admin data
    const stats = {
        totalStudents: 5234,
        newApplications: 147,
        revenue: "₹2.4M",
        placementRate: 95,
    };

    const recentApplications = [
        { id: "APP001", name: "Priya Sharma", dept: "CSE", date: "Jan 25, 2026", status: "pending" },
        { id: "APP002", name: "Rahul Verma", dept: "ECE", date: "Jan 25, 2026", status: "approved" },
        { id: "APP003", name: "Anjali Patel", dept: "Mech", date: "Jan 24, 2026", status: "pending" },
        { id: "APP004", name: "Karthik Raja", dept: "Civil", date: "Jan 24, 2026", status: "rejected" },
        { id: "APP005", name: "Sneha Reddy", dept: "IT", date: "Jan 23, 2026", status: "approved" },
    ];

    const departmentStats = [
        { name: "CSE", students: 1456, applications: 45, color: "blue" },
        { name: "ECE", students: 1123, applications: 32, color: "purple" },
        { name: "Mech", students: 987, applications: 28, color: "orange" },
        { name: "Civil", students: 856, applications: 18, color: "green" },
        { name: "EEE", students: 645, applications: 15, color: "yellow" },
        { name: "IT", students: 567, applications: 9, color: "teal" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved": return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
            case "pending": return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
            case "rejected": return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved": return <CheckCircle className="w-4 h-4" />;
            case "pending": return <Clock className="w-4 h-4" />;
            case "rejected": return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
                <div className="container mx-auto px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md">
                                <Image
                                    src="/logo.png"
                                    alt="VPTC Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-yellow-500" />
                                    Admin Dashboard
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    VPTC Management Portal
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 sticky top-24">
                            <nav className="space-y-2">
                                {[
                                    { id: "overview", icon: TrendingUp, label: "Overview" },
                                    { id: "applications", icon: FileText, label: "Applications" },
                                    { id: "students", icon: Users, label: "Students" },
                                    { id: "departments", icon: Settings, label: "Departments" },
                                    { id: "finance", icon: DollarSign, label: "Finance" },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${activeTab === item.id
                                                ? "bg-yellow-500 text-gray-900 font-medium"
                                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid md:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stats.totalStudents}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                                <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ 12% from last year</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                        <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stats.newApplications}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">New Applications</p>
                                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">Pending review</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stats.revenue}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                                <p className="text-xs text-green-600 dark:text-green-400 mt-2">This semester</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stats.placementRate}%
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Placement Rate</p>
                                <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">2025 Batch</p>
                            </div>
                        </div>

                        {/* Recent Applications */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Recent Applications
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                            <Filter className="w-4 h-4" />
                                            Filter
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-medium">
                                            <Download className="w-4 h-4" />
                                            Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                Application ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                Student Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                Department
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {recentApplications.map((app) => (
                                            <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {app.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                    {app.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                    {app.dept}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                    {app.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                                        {getStatusIcon(app.status)}
                                                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Department Statistics */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Department Overview
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid md:grid-cols-3 gap-4">
                                    {departmentStats.map((dept) => (
                                        <div key={dept.name} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{dept.name}</h3>
                                                <span className={`px-2 py-1 bg-${dept.color}-100 dark:bg-${dept.color}-900/30 text-${dept.color}-600 dark:text-${dept.color}-400 text-xs rounded`}>
                                                    +{dept.applications}
                                                </span>
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                                {dept.students}
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Enrolled Students</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
