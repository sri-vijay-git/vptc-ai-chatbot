import { GraduationCap, Users, Award, TrendingUp, BookOpen, Lightbulb } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-300 dark:from-yellow-600 dark:via-yellow-500 dark:to-yellow-400 py-20">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        About VPTC
                    </h1>
                    <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
                        Vignesh Polytechnic College, Tiruvannamalai – Providing quality Technical Education since 1995.
                    </p>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                        <p>
                            <strong className="text-gray-900 dark:text-white">Vignesh Polytechnic College</strong>, a premier Institution of high repute, was started in the year 1995 to impart quality Technical Education to the students of Tiruvannamalai District and around. Started with three disciplines of Engineering, the Institution has grown and now offers diploma courses in <strong>five disciplines</strong> of Engineering.
                        </p>
                        <p>
                            <strong className="text-gray-900 dark:text-white">Thiru R. Kuppusamy (alias Mani)</strong> is the Chairman of the Board of Directors. A visionary of the highest order, he has played a vital role in the development of this Polytechnic College with his sustained hard work, devotion, and a passion for education.
                        </p>
                        <p>
                            The Institution was <strong className="text-gray-900 dark:text-white">ISO 9001:2008 certified</strong> by DNV and all courses are approved by <strong className="text-gray-900 dark:text-white">AICTE, New Delhi</strong>.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-gray-100 dark:bg-gray-900">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="w-8 h-8 text-yellow-500" />
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                We, at Vignesh Polytechnic College impart Futuristic Technical Education as per curriculum with due importance to Practical oriented training based on the needs of the industries. We with a team of dedicated staff instill high standards of discipline in our students thus making them technologically superior and ethically strong.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Lightbulb className="w-8 h-8 text-yellow-500" />
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Our mission is to provide quality Technical Education in a highly disciplined atmosphere with ethical and moral values to the students from all over Tamilnadu and especially to those from local and rural areas. We provide individual attention, high quality education, and practical training to ensure improvement in lifestyles and contribute to the development of industries.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        VPTC by the Numbers
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: Users, value: "360", label: "First Year Intake" },
                            { icon: GraduationCap, value: "5", label: "Diploma Courses" },
                            { icon: BookOpen, value: "16,500+", label: "Library Books" },
                            { icon: TrendingUp, value: "29+", label: "Years of Excellence" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg">
                                <stat.icon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-16 bg-gray-100 dark:bg-gray-900">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Sree Selvavinayagar Trust</h2>
                    <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
                        Vignesh Polytechnic College was the first Institution to be established by Sree Selvavinayagar Trust in 1995. The trust was formed by Thiru R. Kuppusamy with the sole motive of uplifting Tiruvannamalai District through the power of education. Today, the trust has expanded into the Vignesh Group of Institutions, including the Teacher Training Institute, College of Education, Nursing College, and Vignesh International School.
                    </p>
                </div>
            </section>
        </div>
    );
}
