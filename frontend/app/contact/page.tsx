import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-300 dark:from-yellow-600 dark:via-yellow-500 dark:to-yellow-400 py-20">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Contact Us
                    </h1>
                    <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
                        Reach out to us for admissions, inquiries, or campus visits. We are here to assist you.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                Send us a Message
                            </h2>
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                        placeholder="Your Name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                                        placeholder="+91 123 456 7890"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-6 py-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                    Contact Information
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-8">
                                    Reach out to us through any of the following channels. We're available to assist you with admissions, courses, and any other queries.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Address */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="p-3 bg-yellow-500 rounded-full">
                                        <MapPin className="w-6 h-6 text-gray-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            Campus Address
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            Melputhiyandal Village, Manalurpet Road,<br />
                                            Tiruvannamalai, Tamil Nadu – 606 603,<br />
                                            India.
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="p-3 bg-yellow-500 rounded-full">
                                        <Phone className="w-6 h-6 text-gray-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            Phone
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            9488853917, 9488863917<br />
                                            Mobile: 7373689294
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="p-3 bg-yellow-500 rounded-full">
                                        <Mail className="w-6 h-6 text-gray-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            Email
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            vpt384@yahoo.co.in
                                        </p>
                                    </div>
                                </div>

                                {/* Working Hours */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="p-3 bg-yellow-500 rounded-full">
                                        <Clock className="w-6 h-6 text-gray-900" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            Office Hours
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            Monday - Saturday: 9:00 AM - 5:00 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section (Placeholder) */}
            <section className="py-16 bg-gray-100 dark:bg-gray-900">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="bg-gray-300 dark:bg-gray-700 h-96 rounded-xl flex items-center justify-center">
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            📍 Interactive Campus Map (Coming Soon)
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
