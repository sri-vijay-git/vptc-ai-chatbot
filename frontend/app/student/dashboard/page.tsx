"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen, Calendar, TrendingUp, FileText, User, LogOut, MessageSquare, Award, Clock, CheckCircle, Camera, Save, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProfilePic, saveProfilePic as savePic, removeProfilePic as removePic } from "@/hooks/useProfilePic";

export default function StudentDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const profilePic = useProfilePic();  // shared hook — per-user, auto-updates
    const [profileSaved, setProfileSaved] = useState(false);

    const [studentData, setStudentData] = useState({
        name: "Loading...",
        email: "",
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
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setStudentData(prev => ({
                ...prev,
                name: user.full_name || user.email || "Student",
                email: user.email || ""
            }));
        } else {
            const email = localStorage.getItem("user_email") || "";
            setStudentData(prev => ({
                ...prev,
                name: email.split("@")[0] || "Student",
                email: email
            }));
        }
        // Profile pic is now handled by useProfilePic hook
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-change"));
        router.push("/");
    };

    const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert("File too large. Please choose an image under 5MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result as string;
            savePic(result);
            setProfileSaved(false);
        };
        reader.readAsDataURL(file);
    };

    const saveProfilePicFn = () => {
        if (profilePic) {
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 3000);
        }
    };

    const removeProfilePicFn = () => {
        removePic();
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const initials = studentData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    // Reusable Avatar component
    const Avatar = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
        const sizeClass = size === "lg" ? "w-24 h-24 text-3xl" : size === "sm" ? "w-10 h-10 text-sm" : "w-14 h-14 text-lg";
        return profilePic ? (
            <div className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 ring-2 ring-yellow-400`}>
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            </div>
        ) : (
            <div className={`${sizeClass} bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-gray-900`}>
                {initials}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md flex-shrink-0">
                                <Image src="/logo.png" alt="VPTC Logo" fill className="object-cover" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back, {studentData.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Avatar size="sm" />
                            <Link
                                href="/chat"
                                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-medium transition-colors"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span className="hidden sm:inline">AI Assistant</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
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
                                <div className="flex justify-center mb-4">
                                    <Avatar size="lg" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{studentData.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{studentData.rollNo}</p>
                                <p className="text-xs text-gray-500 mt-1">{studentData.department}</p>
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

                        {/* ===== PROFILE TAB ===== */}
                        {activeTab === "profile" && (
                            <div className="space-y-6">
                                {/* Profile Picture Card */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>

                                    <div className="flex flex-col sm:flex-row items-center gap-8">
                                        {/* Avatar Preview */}
                                        <div className="relative flex-shrink-0">
                                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg">
                                                {profilePic ? (
                                                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-4xl font-bold text-gray-900">
                                                        {initials}
                                                    </div>
                                                )}
                                            </div>
                                            {/* Camera overlay button */}
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute bottom-1 right-1 w-9 h-9 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-full shadow-md flex items-center justify-center transition-colors"
                                                title="Change photo"
                                            >
                                                <Camera className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Upload Controls */}
                                        <div className="flex-1 space-y-4 text-center sm:text-left">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{studentData.name}</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">{studentData.email}</p>
                                            </div>

                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Upload a profile photo. Max size: <strong>5MB</strong>. Supported: JPG, PNG, GIF, WebP.
                                            </p>

                                            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-lg transition-colors"
                                                >
                                                    <Camera className="w-4 h-4" />
                                                    Choose Photo
                                                </button>

                                                {profilePic && (
                                                    <>
                                                        <button
                                                            onClick={saveProfilePicFn}
                                                            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                            {profileSaved ? "Saved ✓" : "Save Photo"}
                                                        </button>
                                                        <button
                                                            onClick={removeProfilePicFn}
                                                            className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 font-medium rounded-lg transition-colors"
                                                        >
                                                            Remove
                                                        </button>
                                                    </>
                                                )}
                                            </div>

                                            {profileSaved && (
                                                <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                                                    ✅ Profile photo saved successfully!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Hidden file input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePicChange}
                                    />
                                </div>

                                {/* Account Info Card */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Information</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <User className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Full Name</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{studentData.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <Mail className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Email Address</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{studentData.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <FileText className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Roll Number</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{studentData.rollNo}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <BookOpen className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Department</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{studentData.department}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== OVERVIEW TAB (default) ===== */}
                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                {/* Stats Cards */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{studentData.cgpa}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Current CGPA</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                            </div>
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{studentData.attendance}%</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Overall Attendance</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                                <BookOpen className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                            </div>
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{studentData.courses.length}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Courses</p>
                                    </div>
                                </div>

                                {/* Current Courses */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Current Semester Courses</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{studentData.semester}</p>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {studentData.courses.map((course, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-semibold rounded">{course.code}</span>
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">{course.name}</h3>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                        <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{course.credits} Credits</span>
                                                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{course.attendance}% Attendance</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-2xl font-bold ${course.grade.startsWith("A") ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}`}>{course.grade}</div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Grade</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Upcoming Events */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Events</h2>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        {studentData.upcomingEvents.map((event, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <div className={`p-3 rounded-lg ${event.type === "exam" ? "bg-red-100 dark:bg-red-900/30" : event.type === "assignment" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
                                                    <Clock className={`w-5 h-5 ${event.type === "exam" ? "text-red-600 dark:text-red-400" : event.type === "assignment" ? "text-blue-600 dark:text-blue-400" : "text-green-600 dark:text-green-400"}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{event.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== OTHER TABS — placeholder ===== */}
                        {(activeTab === "courses" || activeTab === "attendance" || activeTab === "grades") && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                                <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 capitalize">{activeTab}</h3>
                                <p className="text-gray-500 dark:text-gray-400">Detailed {activeTab} data will be available once the backend is connected.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
