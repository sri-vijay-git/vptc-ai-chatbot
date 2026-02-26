"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, User, Mail, ShieldAlert, Camera, Save, CheckCircle, BookOpen, FileText } from "lucide-react";
import api from "@/lib/api";

export default function ProfilePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("User");
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Profile pic state
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [picSaved, setPicSaved] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const u = JSON.parse(userStr);
                setUserEmail(u.email || "user@example.com");
                setUserName(u.full_name || u.email?.split("@")[0] || "User");
            } catch {
                const email = localStorage.getItem("user_email") || "";
                setUserEmail(email || "user@example.com");
                setUserName(email.split("@")[0] || "User");
            }
        } else {
            const email = localStorage.getItem("user_email") || "";
            setUserEmail(email || "user@example.com");
            setUserName(email.split("@")[0] || "User");
        }
        // Load saved profile pic
        const pic = localStorage.getItem("profile_pic");
        if (pic) setProfilePic(pic);
    }, []);

    const processFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("File too large. Max size is 5MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setProfilePic(e.target?.result as string);
            setPicSaved(false);
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

    const handleSavePic = () => {
        if (profilePic) {
            localStorage.setItem("profile_pic", profilePic);
            setPicSaved(true);
            setTimeout(() => setPicSaved(false), 3000);
        }
    };

    const handleRemovePic = () => {
        setProfilePic(null);
        localStorage.removeItem("profile_pic");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            await api.delete("/users/me");
            localStorage.clear();
            router.push("/");
        } catch (error) {
            console.error("Failed to delete account:", error);
            alert("Failed to delete account. Please try again.");
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    };

    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "ST";

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#EFEBE9] to-[#F5F5DC] dark:from-[#1A100E] dark:via-[#2D1B15] dark:to-[#3E2723]">
            {/* Header */}
            <header className="bg-white dark:bg-[#2D1B15] shadow-sm border-b border-[#D7CCC8] dark:border-[#5D4037] sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href="/student/dashboard" className="p-2 text-[#5D4037] dark:text-[#BCAAA4] hover:bg-[#EFEBE9] dark:hover:bg-[#3E2723] rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-[#3E2723] dark:text-[#FFCC80]">Profile Settings</h1>
                        <p className="text-xs text-[#5D4037] dark:text-[#BCAAA4]">Manage your photo and account</p>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">

                {/* ── Profile Photo Card ── */}
                <div className="bg-white dark:bg-[#2D1B15] rounded-2xl shadow-sm border border-[#D7CCC8] dark:border-[#5D4037] p-6">
                    <h2 className="text-base font-bold text-[#3E2723] dark:text-[#FFCC80] mb-5">Profile Photo</h2>

                    <div className="flex flex-col items-center gap-5">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#8B6F47] dark:border-[#FFCC80] shadow-lg">
                                {profilePic ? (
                                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#8B6F47] to-[#6D563C] flex items-center justify-center text-4xl font-bold text-white">
                                        {initials}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-1 right-1 w-9 h-9 bg-[#8B6F47] hover:bg-[#6D563C] text-white rounded-full shadow-md flex items-center justify-center transition-all hover:scale-110"
                                title="Change photo"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Drag & Drop Zone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragOver
                                ? "border-[#8B6F47] bg-[#8B6F47]/10"
                                : "border-[#D7CCC8] dark:border-[#5D4037] hover:border-[#8B6F47] dark:hover:border-[#FFCC80] hover:bg-[#EFEBE9] dark:hover:bg-[#3E2723]/50"
                                }`}
                        >
                            <Camera className="w-7 h-7 text-[#8B6F47] dark:text-[#FFCC80] mx-auto mb-2" />
                            <p className="text-sm font-medium text-[#3E2723] dark:text-[#FFCC80]">Click or drag & drop a photo</p>
                            <p className="text-xs text-[#5D4037] dark:text-[#BCAAA4] mt-1">JPG, PNG, GIF, WebP — max 5MB</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap justify-center gap-3">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-[#8B6F47] hover:bg-[#6D563C] text-white text-sm font-medium rounded-xl transition-all hover:shadow-md"
                            >
                                <Camera className="w-4 h-4" /> Choose Photo
                            </button>
                            {profilePic && (
                                <>
                                    <button
                                        onClick={handleSavePic}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-all hover:shadow-md"
                                    >
                                        {picSaved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Photo</>}
                                    </button>
                                    <button
                                        onClick={handleRemovePic}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 text-sm font-medium rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" /> Remove
                                    </button>
                                </>
                            )}
                        </div>

                        {picSaved && (
                            <p className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Profile photo saved!
                            </p>
                        )}
                    </div>

                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>

                {/* ── Account Info Card ── */}
                <div className="bg-white dark:bg-[#2D1B15] rounded-2xl shadow-sm border border-[#D7CCC8] dark:border-[#5D4037] p-6">
                    <h2 className="text-base font-bold text-[#3E2723] dark:text-[#FFCC80] mb-5">Account Information</h2>
                    <div className="space-y-3">
                        {[
                            { icon: User, label: "Full Name", value: userName },
                            { icon: Mail, label: "Email Address", value: userEmail || "" },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-4 p-4 bg-[#EFEBE9] dark:bg-[#3E2723]/50 rounded-xl">
                                <div className="w-9 h-9 bg-[#8B6F47]/10 dark:bg-[#FFCC80]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-[#8B6F47] dark:text-[#FFCC80]" />
                                </div>
                                <div>
                                    <p className="text-xs text-[#5D4037] dark:text-[#BCAAA4]">{label}</p>
                                    <p className="font-semibold text-[#3E2723] dark:text-white text-sm">{value || "—"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Danger Zone Card ── */}
                <div className="bg-white dark:bg-[#2D1B15] rounded-2xl shadow-sm border border-red-200 dark:border-red-900/30 p-6">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-4">
                        <ShieldAlert className="w-5 h-5" />
                        <h2 className="text-base font-bold">Danger Zone</h2>
                    </div>
                    <p className="text-sm text-[#5D4037] dark:text-[#BCAAA4] mb-4">
                        Deleting your account is permanent. All your data and chat history will be removed.
                    </p>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-red-900/10 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm font-medium transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> Delete Account
                    </button>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#2D1B15] rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4 border border-[#D7CCC8] dark:border-[#5D4037]">
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg font-bold text-[#3E2723] dark:text-white">Delete Account?</h3>
                            <p className="text-sm text-[#5D4037] dark:text-[#BCAAA4] mt-2">
                                This action is permanent and cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 bg-[#EFEBE9] hover:bg-[#D7CCC8] dark:bg-[#3E2723] dark:hover:bg-[#5D4037] text-[#3E2723] dark:text-white rounded-xl text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors"
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
