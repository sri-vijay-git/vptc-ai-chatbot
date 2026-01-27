"use client";

import { useState } from "react";
import { Calendar, FileText, CheckCircle, Upload, GraduationCap, CreditCard } from "lucide-react";

export default function AdmissionsPage() {
    const [formStep, setFormStep] = useState(1);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-300 dark:from-yellow-600 dark:via-yellow-500 dark:to-yellow-400 py-20">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Admissions 2026
                    </h1>
                    <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
                        Start your journey to a successful career. Apply now for our diploma programs
                    </p>
                </div>
            </section>

            {/* Important Dates */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Important Admission Dates
                    </h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { date: "Jan 15, 2026", event: "Applications Open", icon: Calendar, color: "blue" },
                            { date: "Mar 30, 2026", event: "Application Deadline", icon: FileText, color: "red" },
                            { date: "Apr 15, 2026", event: "Entrance Exam", icon: GraduationCap, color: "purple" },
                            { date: "May 1, 2026", event: "Results Announced", icon: CheckCircle, color: "green" },
                        ].map((item, i) => (
                            <div key={i} className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border-t-4 border-${item.color}-500">
                                <item.icon className={`w-12 h-12 text-${item.color}-500 mx-auto mb-4`} />
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
                                    Academic Requirements
                                </h3>
                                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        10th standard pass (minimum 50%)
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        Science and Mathematics required
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        Valid age: 15-20 years
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    Required Documents
                                </h3>
                                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        10th Mark Sheet
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        Transfer Certificate
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        Community Certificate
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        Passport Size Photos
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Form */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                            Online Application Form
                        </h2>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 shadow-lg">
                            <form className="space-y-6">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        Personal Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Date of Birth *
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                                placeholder="+91 123 456 7890"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Information */}
                                <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        Academic Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                10th Percentage *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                max="100"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                                placeholder="85.5"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Year of Passing *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                                placeholder="2025"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Program Selection */}
                                <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        Program Selection
                                    </h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Choose Department *
                                        </label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                        >
                                            <option value="">Select a department</option>
                                            <option>Computer Science & Engineering</option>
                                            <option>Electronics & Communication</option>
                                            <option>Mechanical Engineering</option>
                                            <option>Civil Engineering</option>
                                            <option>Electrical Engineering</option>
                                            <option>Information Technology</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        className="w-full px-6 py-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
                                    >
                                        <Upload className="w-6 h-6" />
                                        Submit Application
                                    </button>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
                                        Application Fee: ₹500 (Non-refundable)
                                    </p>
                                </div>
                            </form>
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
                    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
                        {[
                            { category: "General", amount: "₹45,000/year", includes: "Tuition + Lab Fees" },
                            { category: "OBC/SC/ST", amount: "₹30,000/year", includes: "Government Subsidy" },
                            { category: "Hostel (Optional)", amount: "₹25,000/year", includes: "Accommodation + Food" },
                        ].map((fee, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                                <CreditCard className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{fee.category}</h3>
                                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">{fee.amount}</div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{fee.includes}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
