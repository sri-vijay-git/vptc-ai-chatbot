"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Hide Global Navbar/Footer on specific routes
    // /chat has its own full-screen layout
    // /admin will have its own dashboard layout
    // /login is a standalone page usually, but maybe we want navbar there? Let's keep it for now.
    const isExcluded = pathname?.startsWith("/chat") || pathname?.startsWith("/admin");

    return (
        <div className="flex flex-col min-h-screen">
            {!isExcluded && <Navbar />}
            <main className={`flex-1 ${!isExcluded ? "pt-20" : ""}`}>
                {children}
            </main>
            {!isExcluded && <Footer />}
        </div>
    );
}
