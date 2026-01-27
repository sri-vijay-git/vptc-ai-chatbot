"use client";

import { useState } from "react";
import { BookOpen, Calendar, TrendingUp, FileText, User, Settings, LogOut, MessageSquare, Award, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState("overview");

    // Mock student data
    const studentData = {
        name: "Rajesh Kumar",
        rollNo: "VPTC/CSE/2024/001",
        department: "Computer Science & Engineering",
        semester: "3rd Semester",
        attendance: 92,
        cgpa: 8.7,
        courses: [
            { code: "CS301", name: "Data Structures", credits: 4, grade: "A", attendance: 95 },
            { code: "CS302", name: "Database Management", credits: 3, grade: "A+", attendance: 98 },
            { code: "CS303", name: "Operating Systems", credits: 4, grade: "A", attendance: 90 },
            { code: "MA301", name: "Mathematics III", credits: 3, grade: "B+", attendance: 88 },
        ],
        upcomingEvents: [
            { title: "Mid-term Exams", date: "Feb 15, 2026", type: "exam" },
            { title: "Project Submission", date: "Feb 20, 2026", type: "assignment" },
            { title: "Sports Day", date: "Feb 25, 2026", type: "event" },
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
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
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Student Dashboard
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Welcome back, {studentData.name}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/chat"
                                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-medium transition-colors"
                            >
                                <MessageSquare className="w-4 h-4" />
                                AI Assistant
                            </Link>
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
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                            {/* Profile Section */}
                            <div className="text-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-gray-900">
                                    {studentData.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                    {studentData.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {studentData.rollNo}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    {studentData.department}
                                </p>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-2">
                                {[
                                    { id: "overview", icon: BookOpen, label: "Overview" },
                                    { id: "courses", icon: FileText, label: "My Courses" },
                                    { id: "attendance", icon: Calendar, label: "Attendance" },
                                    { id: "grades", icon: Award, label: "Grades" },
                                    { id: "profile", icon: User, label: "Profile" },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
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
                    <div className="lg:col-span-3 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {studentData.cgpa}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Current CGPA</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {studentData.attendance}%
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Attendance</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                        <BookOpen className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {studentData.courses.length}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Active Courses</p>
                            </div>
                        </div>

                        {/* Current Courses */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Current Semester Courses
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {studentData.semester}
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {studentData.courses.map((course, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-semibold rounded">
                                                        {course.code}
                                                    </span>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {course.name}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <BookOpen className="w-4 h-4" />
                                                        {course.credits} Credits
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {course.attendance}% Attendance
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-2xl font-bold ${course.grade.startsWith('A') ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                                                    }`}>
                                                    {course.grade}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Grade</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Upcoming Events
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    {studentData.upcomingEvents.map((event, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                                        >
                                            <div className={`p-3 rounded-lg ${event.type === 'exam' ? 'bg-red-100 dark:bg-red-900/30' :
                                                    event.type === 'assignment' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                                        'bg-green-100 dark:bg-green-900/30'
                                                }`}>
                                                <Clock className={`w-5 h-5 ${event.type === 'exam' ? 'text-red-600 dark:text-red-400' :
                                                        event.type === 'assignment' ? 'text-blue-600 dark:text-blue-400' :
                                                            'text-green-600 dark:text-green-400'
                                                    }`} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    {event.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {event.date}
                                                </p>
                                            </div>
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
