"use client";

import Link from "next/link";

export default function VerifiedPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#1e3a5f] to-[#0f2744]">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
                <div className="mb-4 text-green-600 text-6xl">✓</div>
                <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Email Verified!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Your email address has been successfully verified. You can now access your account.
                </p>

                <Link
                    href="/login"
                    className="inline-block w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                >
                    Proceed to Login
                </Link>
            </div>
        </div>
    );
}
