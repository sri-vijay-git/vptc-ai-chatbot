import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import "../styles/vptc-theme.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import SettingsApplier from "@/components/SettingsApplier";

const inter = Inter({
    subsets: ["latin"],
    display: 'swap',
    fallback: ['system-ui', 'arial'],
    adjustFontFallback: false
});

export const metadata: Metadata = {
    title: "VPTC AI Chatbot",
    description: "Your College Academic AI Assistant",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} bg-white dark:bg-[#1A100E] transition-colors`}>
                <ThemeProvider>
                    <LanguageProvider>
                        <SettingsApplier />
                        <LayoutWrapper>
                            {children}
                        </LayoutWrapper>
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
