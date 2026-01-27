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
                        Empowering students with quality technical education and innovation for over a decade
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Lightbulb className="w-8 h-8 text-yellow-500" />
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                To provide world-class technical education that empowers students with the skills, knowledge, and
                                values needed to excel in their careers and contribute meaningfully to society.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="w-8 h-8 text-yellow-500" />
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                To be a leading polytechnic institution recognized for academic excellence, innovation,
                                and producing industry-ready professionals who drive technological advancement.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-100 dark:bg-gray-900">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        VPTC by the Numbers
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: Users, value: "5000+", label: "Students" },
                            { icon: GraduationCap, value: "200+", label: "Faculty Members" },
                            { icon: BookOpen, value: "15+", label: "Departments" },
                            { icon: TrendingUp, value: "95%", label: "Placement Rate" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                                <stat.icon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Our Core Values
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Excellence", desc: "We strive for the highest standards in education and research" },
                            { title: "Innovation", desc: "We encourage creative thinking and problem-solving" },
                            { title: "Integrity", desc: "We uphold honesty and ethical conduct in all our endeavors" },
                            { title: "Inclusivity", desc: "We embrace diversity and provide equal opportunities" },
                            { title: "Collaboration", desc: "We foster teamwork and industry partnerships" },
                            { title: "Sustainability", desc: "We promote environmental and social responsibility" },
                        ].map((value, i) => (
                            <div key={i} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border-l-4 border-yellow-500">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
