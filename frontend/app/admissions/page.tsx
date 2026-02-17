"use client";

import { Calendar, FileText, CheckCircle, Upload, GraduationCap, CreditCard } from "lucide-react";
import Link from "next/link";

export default function AdmissionsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-300 dark:from-yellow-600 dark:via-yellow-500 dark:to-yellow-400 py-20">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Admissions
                    </h1>
                    <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
                        Join Vignesh Polytechnic College. Start your journey in Engineering & Technology.
                    </p>
                </div>
            </section>

            {/* Important Dates */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Admission Overview
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { date: "Open Now", event: "Applications for 2024-25 Batch", icon: Calendar },
                            { date: "SSLC / 10th", event: "Minimum Eligibility (No Age Limit)", icon: GraduationCap },
                            { date: "Merit Based", event: "Selection Process", icon: CheckCircle },
                        ].map((item, i) => (
                            <div key={i} className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border-t-4 border-yellow-500">
                                <item.icon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.date}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{item.event}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Eligibility */}
            <section className="py-16 bg-gray-100 dark:bg-gray-900">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                            Eligibility Criteria
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    First Year (Semester 1)
                                </h3>
                                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        Pass in SSLC (10th) or equivalent.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <strong>No Age Limit.</strong>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Lateral Entry (Direct 2nd Year)
                                </h3>
                                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        HSC (Vocational or Academic) pass with Maths/Physics/Chemistry.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        10th pass + 2-year ITI course in relevant trade.
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Documents Required
                            </h3>
                            <ul className="grid md:grid-cols-2 gap-3 text-gray-600 dark:text-gray-300">
                                <li className="flex items-start gap-2"><FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> 10th Mark Sheet</li>
                                <li className="flex items-start gap-2"><FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> Transfer Certificate (TC)</li>
                                <li className="flex items-start gap-2"><FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> Community Certificate</li>
                                <li className="flex items-start gap-2"><FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> Passport Size Photos</li>
                                <li className="flex items-start gap-2"><FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> Migration Certificate (for other boards)</li>
                                <li className="flex items-start gap-2"><FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> Conduct Certificate</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            Courses Offered
                        </h2>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 shadow-lg text-left">
                            <ul className="space-y-4">
                                {[
                                    "Civil Engineering",
                                    "Mechanical Engineering",
                                    "Electrical & Electronics Engineering (EEE)",
                                    "Electronics & Communication Engineering (ECE)",
                                    "Computer Science Engineering"
                                ].map((course, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-lg font-medium text-gray-800 dark:text-gray-200">
                                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                        {course}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fee Structure */}
            <section className="py-16 bg-gray-100 dark:bg-gray-900">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Fee Structure
                    </h2>
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                            <CreditCard className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Affordable Education</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                                Tuition fees are collected as per the norms fixed by the <strong className="text-gray-900 dark:text-white">Government of Tamil Nadu</strong>.
                            </p>
                            <Link
                                href="https://vigneshpolytechniccollege.com/wp-content/uploads/2024/06/fee24-25.pdf"
                                target="_blank"
                                className="inline-block mt-4 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full transition-colors"
                            >
                                View Fee Details (PDF)
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application CTA */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ready to Apply?</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Applicant should visit the campus along with their Parent/Guardian for Admission. Download the application form or apply online.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="https://vigneshpolytechniccollege.com/wp-content/uploads/2020/07/Admission-1.pdf" target="_blank" className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full transition-colors">
                            Download 1st Year Form
                        </Link>
                        <Link href="https://vigneshpolytechniccollege.com/wp-content/uploads/2020/07/Admission-2.pdf" target="_blank" className="px-8 py-3 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-full transition-colors">
                            Download Lateral Entry Form
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
