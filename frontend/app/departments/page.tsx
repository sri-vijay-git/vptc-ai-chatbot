import { Code, Cpu, Wrench, Building, Zap, Database, BookOpen, Users } from "lucide-react";
import Link from "next/link";

const departments = [
    {
        name: "Computer Science & Engineering",
        icon: Code,
        description: "Leading-edge computing education with focus on AI, Machine Learning, and Software Development",
        courses: ["Diploma in CSE", "Advanced Diploma in AI"],
        placements: "98%",
        color: "from-blue-500 to-blue-600"
    },
    {
        name: "Electronics & Communication",
        icon: Cpu,
        description: "Innovation in electronics, embedded systems, and communication technologies",
        courses: ["Diploma in ECE", "IoT Specialization"],
        placements: "95%",
        color: "from-purple-500 to-purple-600"
    },
    {
        name: "Mechanical Engineering",
        icon: Wrench,
        description: "Excellence in manufacturing, design, and automation",
        courses: ["Diploma in Mech", "CAD/CAM Advanced"],
        placements: "92%",
        color: "from-orange-500 to-orange-600"
    },
    {
        name: "Civil Engineering",
        icon: Building,
        description: "Building the future with sustainable construction and infrastructure",
        courses: ["Diploma in Civil", "Green Building Tech"],
        placements: "90%",
        color: "from-green-500 to-green-600"
    },
    {
        name: "Electrical Engineering",
        icon: Zap,
        description: "Power systems, renewable energy, and electrical automation",
        courses: ["Diploma in EEE", "Renewable Energy"],
        placements: "93%",
        color: "from-yellow-500 to-yellow-600"
    },
    {
        name: "Information Technology",
        icon: Database,
        description: "Modern IT solutions, cloud computing, and cybersecurity",
        courses: ["Diploma in IT", "Cloud Architecture"],
        placements: "97%",
        color: "from-teal-500 to-teal-600"
    },
];

export default function DepartmentsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-300 dark:from-yellow-600 dark:via-yellow-500 dark:to-yellow-400 py-20">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Our Departments
                    </h1>
                    <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
                        Explore our diverse range of technical programs designed to prepare you for industry success
                    </p>
                </div>
            </section>

            {/* Departments Grid */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {departments.map((dept, i) => (
                            <div key={i} className="group bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                {/* Header with Gradient */}
                                <div className={`bg-gradient-to-r ${dept.color} p-6 text-white`}>
                                    <dept.icon className="w-12 h-12 mb-4" />
                                    <h3 className="text-2xl font-bold">{dept.name}</h3>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {dept.description}
                                    </p>

                                    {/* Courses */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <BookOpen className="w-4 h-4" />
                                            Programs Offered
                                        </h4>
                                        <ul className="space-y-1">
                                            {dept.courses.map((course, idx) => (
                                                <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                                                    • {course}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Placement Rate */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                                        <Users className="w-5 h-5 text-green-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Placement Rate: <strong className="text-green-600 dark:text-green-400">{dept.placements}</strong>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-yellow-500 to-yellow-400 dark:from-yellow-600 dark:to-yellow-500">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto">
                        Join thousands of students who have transformed their careers with our industry-focused programs
                    </p>
                    <Link
                        href="/admissions"
                        className="inline-block px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors shadow-lg"
                    >
                        Apply Now
                    </Link>
                </div>
            </section>
        </div>
    );
}
