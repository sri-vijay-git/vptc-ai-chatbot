import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
            <h1 className="text-5xl font-bold mb-8 text-primary">VPTC AI Chatbot</h1>
            <p className="text-xl mb-12 max-w-2xl text-gray-600 dark:text-gray-300">
                Welcome to Vignesh Polytechnic College's Advanced AI Assistant.
                Get instant answers about courses, exams, fees, and more.
            </p>

            <div className="flex gap-4 flex-wrap justify-center">
                <Link href="/chat"
                    className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Try as Guest (3 Free Chats)
                </Link>
                <Link href="/signup"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    Sign Up (New Student)
                </Link>
                <Link href="/login"
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
                    Student Login
                </Link>
                <Link href="/login"
                    className="px-6 py-3 border border-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    Admin Login
                </Link>
            </div>
        </main>
    );
}
