"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Trash2, User, Mail, ShieldAlert } from "lucide-react";
import api from "@/lib/api";

export default function ProfilePage() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem('user_email');
        if (email) {
            setUserEmail(email);
        } else {
            // If no email, maybe redirect or just show 'User'
            setUserEmail('User'); // Fallback
        }
    }, []);

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            await api.delete("/users/me");
            // Clear local storage
            localStorage.clear();
            // Redirect to home
            router.push("/");
        } catch (error) {
            console.error("Failed to delete account:", error);
            alert("Failed to delete account. Please try again.");
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm p-4 w-full sticky top-0 z-10">
                <div className="max-w-2xl mx-auto flex items-center">
                    <Link href="/chat" className="p-2 mr-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-xl font-bold">Profile Settings</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4 space-y-6 mt-4">

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 flex flex-col items-center border-b border-gray-200 dark:border-gray-700 bg-gradient-to-b from-blue-50 to-white dark:from-gray-700 dark:to-gray-800">
                        <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-md mb-4">
                            {userEmail ? userEmail.charAt(0).toUpperCase() : <User className="w-12 h-12" />}
                        </div>
                        <h2 className="text-lg font-semibold">{userEmail?.split('@')[0]}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</p>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-900/30 overflow-hidden">
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20 flex items-center gap-2 text-red-700 dark:text-red-400">
                        <ShieldAlert className="w-5 h-5" />
                        <h3 className="font-semibold">Danger Zone</h3>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Deleting your account is permanent. All your data and chat history will be removed.
                        </p>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full sm:w-auto px-4 py-2 bg-white border border-red-300 text-red-600 hover:bg-red-50 dark:bg-red-900/10 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                        </button>
                    </div>
                </div>
            </main>

            {/* Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Account?</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Are you sure you want to delete your account? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
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
