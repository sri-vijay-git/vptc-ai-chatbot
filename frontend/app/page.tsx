import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
            <h1 className="text-5xl font-bold mb-8 text-primary">VPTC AI Chatbot</h1>
            <p className="text-xl mb-12 max-w-2xl text-gray-600 dark:text-gray-300">
                Welcome to Vignesh Polytechnic College's Advanced AI Assistant.
                Get instant answers about courses, exams, fees, and more.
            </p>

            <div className="flex gap-4">
                <Link href="/login"
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition">
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
