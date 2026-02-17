import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                            Vignesh Polytechnic College
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Managed by Sree Selvavinayagar Trust. Providing quality technical education since 1995.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {["About Us", "Admissions", "Departments", "Campus", "Contact"].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/${item.toLowerCase().replace(" ", "-")}`}
                                        className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Departments */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Departments</h3>
                        <ul className="space-y-3">
                            {["Civil Engg.", "Mechanical Engg.", "EEE", "ECE", "Computer Sci. Engg."].map((item) => (
                                <li key={item}>
                                    <Link
                                        href="/departments"
                                        className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <MapPin className="w-5 h-5 text-yellow-500 shrink-0" />
                                <span>Melputhiyandal, Manalurpet Road, Tiruvannamalai - 606603</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Phone className="w-5 h-5 text-yellow-500 shrink-0" />
                                <span>9488853917 / 7373689294</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Mail className="w-5 h-5 text-yellow-500 shrink-0" />
                                <span>vpt384@yahoo.co.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Vignesh Polytechnic College. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="p-2 bg-gray-800 rounded-full text-gray-400 hover:bg-yellow-500 hover:text-white transition-all transform hover:-translate-y-1"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
