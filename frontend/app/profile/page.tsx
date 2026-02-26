"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Save, User, Mail, FileText, BookOpen, ArrowLeft, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const [user, setUser] = useState({
        full_name: "",
        email: "",
        role: "student",
        rollNo: "VPTC/CSE/2024/001",
        department: "Computer Science & Engineering",
        semester: "3rd Semester",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const u = JSON.parse(userStr);
            setUser((prev) => ({
                ...prev,
                full_name: u.full_name || u.email?.split("@")[0] || "Student",
                email: u.email || "",
                role: u.role || "student",
            }));
        }
        const pic = localStorage.getItem("profile_pic");
        if (pic) setProfilePic(pic);
    }, [router]);

    const initials = user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "ST";

    const processFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("File too large. Max allowed size is 5MB.");
            return;
        }
        setUploading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            setProfilePic(e.target?.result as string);
            setSaved(false);
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleSave = () => {
        if (profilePic) {
            localStorage.setItem("profile_pic", profilePic);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    const handleRemove = () => {
        setProfilePic(null);
        localStorage.removeItem("profile_pic");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setSaved(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#EFEBE9] to-[#F5F5DC] dark:from-[#1A100E] dark:via-[#2D1B15] dark:to-[#3E2723] py-10 px-4">
            <div className="max-w-2xl mx-auto">

                {/* Back Button */}
                <Link
                    href="/student/dashboard"
                    className="inline-flex items-center gap-2 text-sm text-[#5D4037] dark:text-[#BCAAA4] hover:text-[#3E2723] dark:hover:text-[#FFCC80] mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#3E2723] dark:text-[#FFCC80]">My Profile</h1>
                    <p className="text-[#5D4037] dark:text-[#BCAAA4] mt-1">Manage your personal information and profile photo</p>
                </div>

                {/* Profile Picture Card */}
                <div className="bg-white dark:bg-[#2D1B15] rounded-2xl shadow-lg border border-[#D7CCC8] dark:border-[#5D4037] p-8 mb-6">
                    <h2 className="text-lg font-bold text-[#3E2723] dark:text-[#FFCC80] mb-6">Profile Photo</h2>

                    <div className="flex flex-col items-center gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#8B6F47] dark:border-[#FFCC80] shadow-xl">
                                {profilePic ? (
                                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#8B6F47] to-[#6D563C] flex items-center justify-center text-5xl font-bold text-white">
                                        {initials}
                                    </div>
                                )}
                            </div>
                            {/* Camera Button */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-2 right-2 w-10 h-10 bg-[#8B6F47] hover:bg-[#6D563C] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                                title="Change photo"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Drag & Drop Upload Zone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragOver
                                    ? "border-[#8B6F47] bg-[#8B6F47]/10"
                                    : "border-[#D7CCC8] dark:border-[#5D4037] hover:border-[#8B6F47] dark:hover:border-[#FFCC80] hover:bg-[#EFEBE9] dark:hover:bg-[#3E2723]/50"
                                }`}
                        >
                            <Camera className="w-8 h-8 text-[#8B6F47] dark:text-[#FFCC80] mx-auto mb-3" />
                            <p className="text-sm font-medium text-[#3E2723] dark:text-[#FFCC80]">
                                {uploading ? "Processing..." : "Click to upload or drag & drop"}
                            </p>
                            <p className="text-xs text-[#5D4037] dark:text-[#BCAAA4] mt-1">
                                JPG, PNG, GIF, WebP — max 5MB
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-3 w-full">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#8B6F47] hover:bg-[#6D563C] text-white font-medium rounded-xl transition-all hover:shadow-md"
                            >
                                <Camera className="w-4 h-4" />
                                Choose Photo
                            </button>

                            {profilePic && (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className={`flex items-center gap-2 px-5 py-2.5 font-medium rounded-xl transition-all hover:shadow-md ${saved
                                                ? "bg-green-500 text-white"
                                                : "bg-green-500 hover:bg-green-600 text-white"
                                            }`}
                                    >
                                        {saved ? (
                                            <><CheckCircle className="w-4 h-4" /> Saved!</>
                                        ) : (
                                            <><Save className="w-4 h-4" /> Save Photo</>
                                        )}
                                    </button>

                                    <button
                                        onClick={handleRemove}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 font-medium rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Remove
                                    </button>
                                </>
                            )}
                        </div>

                        {saved && (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
                                <CheckCircle className="w-4 h-4" />
                                Profile photo saved successfully!
                            </div>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Account Info Card */}
                <div className="bg-white dark:bg-[#2D1B15] rounded-2xl shadow-lg border border-[#D7CCC8] dark:border-[#5D4037] p-8">
                    <h2 className="text-lg font-bold text-[#3E2723] dark:text-[#FFCC80] mb-6">Account Information</h2>
                    <div className="space-y-4">
                        {[
                            { icon: User, label: "Full Name", value: user.full_name },
                            { icon: Mail, label: "Email Address", value: user.email },
                            { icon: FileText, label: "Roll Number", value: user.rollNo },
                            { icon: BookOpen, label: "Department", value: user.department },
                            { icon: BookOpen, label: "Semester", value: user.semester },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-4 p-4 bg-[#EFEBE9] dark:bg-[#3E2723]/50 rounded-xl">
                                <div className="w-10 h-10 bg-[#8B6F47]/10 dark:bg-[#FFCC80]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-[#8B6F47] dark:text-[#FFCC80]" />
                                </div>
                                <div>
                                    <p className="text-xs text-[#5D4037] dark:text-[#BCAAA4]">{label}</p>
                                    <p className="font-semibold text-[#3E2723] dark:text-white">{value || "—"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
