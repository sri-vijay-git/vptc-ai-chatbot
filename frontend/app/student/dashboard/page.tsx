"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen, Calendar, TrendingUp, FileText, User, LogOut, MessageSquare, Award, Clock, CheckCircle, Camera, Save, Mail, Edit2, X, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProfilePic, saveProfilePic as savePic, removeProfilePic as removePic } from "@/hooks/useProfilePic";
import api from "@/lib/api";

export default function StudentDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const profilePic = useProfilePic();  // shared hook — per-user, auto-updates
    const [profileSaved, setProfileSaved] = useState(false);
    
    // Dynamic Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        roll_no: "",
        department: "",
        semester: "",
        cgpa: 0.0,
        attendance: 0.0
    });

    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [newCourse, setNewCourse] = useState({ code: "", name: "", credits: 3, grade: "A", attendance: 100 });
    const [newExam, setNewExam] = useState({ subject: "", minMarks: 0, maxMarks: 100, obtainedMarks: 0 });

    const [studentData, setStudentData] = useState({
        name: "Loading...",
        email: "",
        rollNo: "",
        department: "",
        semester: "",
        attendance: 0,
        cgpa: 0,
        courses: [] as any[],
        examMarks: [] as any[],
        upcomingEvents: [] as any[]
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        fetchProfile();
        fetchChatHistory();
    }, [router]);

    const fetchChatHistory = async () => {
        try {
            const res = await api.get("/history/");
            setChatHistory(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await api.get("/student/profile");
            const data = response.data;
            setStudentData(prev => ({
                ...prev,
                name: data.name,
                email: data.email,
                rollNo: data.roll_no,
                department: data.department,
                semester: data.semester,
                cgpa: data.cgpa,
                attendance: data.attendance,
                courses: data.courses || prev.courses,
                examMarks: data.exam_marks || prev.examMarks,
                upcomingEvents: data.upcomingEvents || prev.upcomingEvents
            }));
            setEditForm({
                roll_no: data.roll_no !== "Not Set" ? data.roll_no : "",
                department: data.department !== "Not Set" ? data.department : "",
                semester: data.semester !== "Not Set" ? data.semester : "",
                cgpa: data.cgpa,
                attendance: data.attendance
            });
        } catch (error) {
            console.error("Failed to fetch profile", error);
            // Fallback
            const email = localStorage.getItem("user_email") || "";
            setStudentData(prev => ({
                ...prev,
                name: email.split("@")[0] || "Student",
                email: email
            }));
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await api.post("/student/profile", editForm);
            await fetchProfile(); // Refresh live data
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save profile", error);
            alert("Failed to save profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddCourse = async () => {
        const updatedCourses = [...studentData.courses, newCourse];
        try {
            await api.post("/student/profile", { courses: updatedCourses });
            setStudentData(prev => ({ ...prev, courses: updatedCourses }));
            setNewCourse({ code: "", name: "", credits: 3, grade: "A", attendance: 100 });
        } catch (e) {
            alert("Failed to add course.");
        }
    };

    const handleRemoveCourse = async (index: number) => {
        const updatedCourses = studentData.courses.filter((_, i) => i !== index);
        try {
            await api.post("/student/profile", { courses: updatedCourses });
            setStudentData(prev => ({ ...prev, courses: updatedCourses }));
        } catch (e) {
            alert("Failed to remove course.");
        }
    };

    const handleAddExam = async () => {
        const updatedExams = [...studentData.examMarks, newExam];
        try {
            await api.post("/student/profile", { exam_marks: updatedExams });
            setStudentData(prev => ({ ...prev, examMarks: updatedExams }));
            setNewExam({ subject: "", minMarks: 0, maxMarks: 100, obtainedMarks: 0 });
        } catch (e) {
            alert("Failed to add exam.");
        }
    };

    const handleRemoveExam = async (index: number) => {
        const updatedExams = studentData.examMarks.filter((_, i) => i !== index);
        try {
            await api.post("/student/profile", { exam_marks: updatedExams });
            setStudentData(prev => ({ ...prev, examMarks: updatedExams }));
        } catch (e) {
            alert("Failed to remove exam.");
        }
    };

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
                                    { id: "grades", icon: Award, label: "Grades & Exams" },
                                    { id: "history", icon: MessageSquare, label: "Saved Chats" },
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
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Academic Details</h3>
                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit Info
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={isSaving}
                                                    className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {isSaving ? "Saving..." : "Save"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {!isEditing ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                    <p className="font-medium text-gray-900 dark:text-white truncate">{studentData.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Roll Number</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{studentData.rollNo}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <BookOpen className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Department</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{studentData.department}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Semester</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{studentData.semester}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">CGPA & Attendance</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">{studentData.cgpa} CGPA ( {studentData.attendance}% )</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-900/50 md:col-span-2">
                                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                                    Update your academic records here. This data powers your dynamic dashboard overview!
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Roll Number</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                                                    value={editForm.roll_no}
                                                    onChange={e => setEditForm({...editForm, roll_no: e.target.value})}
                                                    placeholder="VPTC/CSE/001"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                                                    value={editForm.department}
                                                    onChange={e => setEditForm({...editForm, department: e.target.value})}
                                                    placeholder="Computer Science"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Semester</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                                                    value={editForm.semester}
                                                    onChange={e => setEditForm({...editForm, semester: e.target.value})}
                                                    placeholder="3rd Semester"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CGPA</label>
                                                    <input 
                                                        type="number" step="0.1" 
                                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                                                        value={editForm.cgpa}
                                                        onChange={e => setEditForm({...editForm, cgpa: parseFloat(e.target.value) || 0})}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Attendance %</label>
                                                    <input 
                                                        type="number" step="0.1" 
                                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                                                        value={editForm.attendance}
                                                        onChange={e => setEditForm({...editForm, attendance: parseFloat(e.target.value) || 0})}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
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

                        {/* ===== COURSES TAB ===== */}
                        {activeTab === "courses" && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Assigned Courses</h2>
                                <p className="text-sm text-gray-500 mb-6">These courses are managed by your department staff.</p>

                                {/* Course List */}
                                <div className="space-y-4">
                                    {studentData.courses.length === 0 ? (
                                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No courses added yet.</p>
                                    ) : (
                                        studentData.courses.map((course, i) => (
                                            <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-semibold rounded">{course.code}</span>
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">{course.name}</h3>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{course.credits} Credits</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ===== GRADES & EXAMS TAB ===== */}
                        {activeTab === "grades" && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Grades & Exam Tracking</h2>
                                <p className="text-sm text-gray-500 mb-6">Your official exam marks are updated by your department staff.</p>

                                {/* Exam List */}
                                <div className="space-y-4">
                                    {studentData.examMarks.length === 0 ? (
                                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No exam records found.</p>
                                    ) : (
                                        studentData.examMarks.map((exam, i) => {
                                            const percent = Math.round((exam.obtainedMarks / exam.maxMarks) * 100);
                                            const isPass = percent >= 40;
                                            return (
                                                <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 gap-4">
                                                    <div className="flex-1 w-full relative">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{exam.subject}</h3>
                                                        <div className="w-full max-w-sm bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                                            <div className={`h-2.5 rounded-full ${isPass ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6 min-w-[150px] justify-end">
                                                        <div className="text-right">
                                                            <div className={`text-xl font-bold ${isPass ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{exam.obtainedMarks} <span className="text-sm font-normal text-gray-500">/ {exam.maxMarks}</span></div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">{percent}% ({isPass ? 'Pass' : 'Fail'})</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ===== ATTENDANCE TAB ===== */}
                        {activeTab === "attendance" && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Overall Attendance: {studentData.attendance}%</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-lg mx-auto">Attendance is tracked by the Staff Portal. Maintain above 75% to be eligible for board exams.</p>
                                <div className="max-w-md mx-auto bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                                    <div className={`h-4 transition-all duration-1000 ${studentData.attendance >= 75 ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${Math.min(studentData.attendance, 100)}%` }}></div>
                                </div>
                            </div>
                        )}

                        {/* ===== CHAT HISTORY TAB ===== */}
                        {activeTab === "history" && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">My AI Consultations</h2>
                                    <Link href="/chat" className="text-sm text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 font-medium flex items-center gap-1">
                                        New Chat <Plus className="w-3 h-3" />
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {chatHistory.length === 0 ? (
                                        <div className="text-center py-8">
                                            <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                            <p className="text-gray-500 dark:text-gray-400">No chat history found.</p>
                                        </div>
                                    ) : (
                                        chatHistory.map((chat: any, i) => (
                                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-yellow-400 dark:hover:border-yellow-500 transition-colors">
                                                <div className="mb-3 sm:mb-0">
                                                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">{chat.title || "VPTC Query"}</h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        <Clock className="w-3 h-3 inline mr-1 border-none" />
                                                        {new Date(chat.timestamp).toLocaleDateString()} at {new Date(chat.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </p>
                                                </div>
                                                <Link href={`/chat?session=${chat.id}`} className="px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center inline-block">
                                                    View Conversation
                                                </Link>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
