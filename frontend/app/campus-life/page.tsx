"use client";

import { Users, Calendar, Trophy, Music, Book, Coffee, Dumbbell, Camera, Brush, Code, Heart, Globe } from "lucide-react";
import Image from "next/image";

export default function CampusLifePage() {
    const clubs = [
        { name: "Coding Club", icon: <Code className="w-6 h-6" />, members: "150+", description: "Hackathons, coding competitions, and workshops" },
        { name: "Cultural Club", icon: <Music className="w-6 h-6" />, members: "200+", description: "Dance, music, drama, and cultural events" },
        { name: "Sports Club", icon: <Trophy className="w-6 h-6" />, members: "180+", description: "Cricket, football, basketball, and athletics" },
        { name: "Photography Club", icon: <Camera className="w-6 h-6" />, members: "80+", description: "Campus photography and visual storytelling" },
        { name: "Art & Design Club", icon: <Brush className="w-6 h-6" />, members: "90+", description: "Painting, sketching, and digital art" },
        { name: "Social Service Club", icon: <Heart className="w-6 h-6" />, members: "120+", description: "Community service and social initiatives" },
    ];

    const facilities = [
        { name: "Modern Library", icon: <Book className="w-8 h-8" />, description: "20,000+ books, digital resources, and study spaces" },
        { name: "Gymnasium", icon: <Dumbbell className="w-8 h-8" />, description: "State-of-the-art equipment and fitness programs" },
        { name: "Cafeteria", icon: <Coffee className="w-8 h-8" />, description: "Hygienic food service with diverse menu options" },
        { name: "Auditorium", icon: <Users className="w-8 h-8" />, description: "500-seater hall for events and seminars" },
    ];

    const events = [
        { name: "Annual Tech Fest", date: "February 2026", type: "Technical" },
        { name: "Cultural Festival", date: "March 2026", type: "Cultural" },
        { name: "Sports Week", date: "January 2026", type: "Sports" },
        { name: "Industry Expert Talks", date: "Monthly", type: "Academic" },
    ];

    const testimonials = [
        {
            name: "Rahul Sharma",
            batch: "CSE 2024",
            text: "The campus life at VPTC is vibrant! From coding competitions to cultural fests, there's always something exciting happening.",
            avatar: "👨‍🎓"
        },
        {
            name: "Priya Patel",
            batch: "ECE 2025",
            text: "Being part of the cultural club helped me discover my passion for dance. The support from faculty and friends has been amazing!",
            avatar: "👩‍🎓"
        },
        {
            name: "Amit Kumar",
            batch: "ME 2024",
            text: "The sports facilities are top-notch! I've represented our college in multiple inter-college tournaments.",
            avatar: "👨‍🎓"
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff8e1] via-[#ffe0b2] to-[#ffcc80] dark:from-[#1a100e] dark:via-[#2d1b15] dark:to-[#3e2723]">
            {/* Hero Section */}
            <section className="relative py-20 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-[#3e2723] dark:text-[#ffcc80] mb-6">
                        Campus Life at VPTC
                    </h1>
                    <p className="text-xl text-[#5d4037] dark:text-[#ffcc80]/80 max-w-3xl mx-auto">
                        Experience a vibrant community where learning meets fun, innovation meets tradition, and dreams meet opportunities.
                    </p>
                </div>
            </section>

            {/* Student Clubs */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-[#3e2723] dark:text-[#ffcc80] mb-4">Student Clubs</h2>
                        <p className="text-lg text-[#5d4037] dark:text-[#ffcc80]/70">Join like-minded peers and pursue your passions</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clubs.map((club, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-[#3e2723] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-[#d7ccc8] dark:border-[#5d4037]"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-[#ffcc80] dark:bg-[#5d4037] rounded-lg text-[#3e2723] dark:text-[#ffcc80]">
                                        {club.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-[#3e2723] dark:text-[#ffcc80]">{club.name}</h3>
                                        <p className="text-sm text-[#5d4037] dark:text-[#ffcc80]/70">{club.members} members</p>
                                    </div>
                                </div>
                                <p className="text-[#5d4037] dark:text-[#ffcc80]/80">{club.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Campus Facilities */}
            <section className="py-16 px-4 bg-white/30 dark:bg-black/20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-[#3e2723] dark:text-[#ffcc80] mb-4">Campus Facilities</h2>
                        <p className="text-lg text-[#5d4037] dark:text-[#ffcc80]/70">World-class amenities for your holistic development</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {facilities.map((facility, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-[#3e2723] p-6 rounded-2xl shadow-lg text-center border border-[#d7ccc8] dark:border-[#5d4037] hover:shadow-xl transition-all"
                            >
                                <div className="inline-flex p-4 bg-[#ffcc80] dark:bg-[#5d4037] rounded-full text-[#3e2723] dark:text-[#ffcc80] mb-4">
                                    {facility.icon}
                                </div>
                                <h3 className="font-bold text-lg text-[#3e2723] dark:text-[#ffcc80] mb-2">{facility.name}</h3>
                                <p className="text-sm text-[#5d4037] dark:text-[#ffcc80]/80">{facility.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Upcoming Events */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-[#3e2723] dark:text-[#ffcc80] mb-4">Upcoming Events</h2>
                        <p className="text-lg text-[#5d4037] dark:text-[#ffcc80]/70">Mark your calendars for these exciting events</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {events.map((event, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-[#3e2723] p-6 rounded-2xl shadow-lg border border-[#d7ccc8] dark:border-[#5d4037] flex items-center gap-4 hover:shadow-xl transition-all"
                            >
                                <div className="p-4 bg-[#ffcc80] dark:bg-[#5d4037] rounded-lg">
                                    <Calendar className="w-8 h-8 text-[#3e2723] dark:text-[#ffcc80]" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-[#3e2723] dark:text-[#ffcc80]">{event.name}</h3>
                                    <p className="text-sm text-[#5d4037] dark:text-[#ffcc80]/70">{event.date}</p>
                                    <span className="inline-block mt-2 px-3 py-1 bg-[#ffcc80]/30 dark:bg-[#5d4037]/30 text-xs font-medium rounded-full text-[#3e2723] dark:text-[#ffcc80]">
                                        {event.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Student Testimonials */}
            <section className="py-16 px-4 bg-white/30 dark:bg-black/20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-[#3e2723] dark:text-[#ffcc80] mb-4">Student Voices</h2>
                        <p className="text-lg text-[#5d4037] dark:text-[#ffcc80]/70">Hear from our amazing student community</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-[#3e2723] p-6 rounded-2xl shadow-lg border border-[#d7ccc8] dark:border-[#5d4037]"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-4xl">{testimonial.avatar}</div>
                                    <div>
                                        <h4 className="font-bold text-[#3e2723] dark:text-[#ffcc80]">{testimonial.name}</h4>
                                        <p className="text-sm text-[#5d4037] dark:text-[#ffcc80]/70">{testimonial.batch}</p>
                                    </div>
                                </div>
                                <p className="text-[#5d4037] dark:text-[#ffcc80]/80 italic">&ldquo;{testimonial.text}&rdquo;</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center bg-[#3e2723] dark:bg-[#5d4037] p-12 rounded-3xl shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#ffcc80] mb-6">
                        Ready to Be Part of the VPTC Family?
                    </h2>
                    <p className="text-lg text-[#ffcc80]/80 mb-8">
                        Join us and experience the perfect blend of academics, extracurriculars, and lifelong friendships.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a
                            href="/admissions"
                            className="px-8 py-4 bg-[#ffcc80] text-[#3e2723] rounded-lg font-semibold hover:bg-[#ffb74d] transition-colors shadow-lg"
                        >
                            Apply Now
                        </a>
                        <a
                            href="/contact"
                            className="px-8 py-4 bg-transparent border-2 border-[#ffcc80] text-[#ffcc80] rounded-lg font-semibold hover:bg-[#ffcc80] hover:text-[#3e2723] transition-colors"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
