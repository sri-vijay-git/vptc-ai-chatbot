"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "English" | "Tamil";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

// ─── All app-wide translations ───────────────────────────────────────────────
export const TRANSLATIONS: Record<Language, Record<string, string>> = {
    English: {
        // Settings – general
        appearance: "Appearance",
        appearanceDesc: "Customize how VPTC AI looks on your device.",
        theme: "Theme",
        chatFontSize: "Chat Font Size",
        language: "Language",
        small: "Small",
        medium: "Medium",
        large: "Large",
        light: "Light",
        dark: "Dark",
        system: "System",
        chatAndAI: "Chat & AI",
        chatDesc: "Control how the AI chat behaves.",
        streamingResponses: "Streaming Responses",
        streamingDesc: "Show AI response word-by-word as it generates",
        messageSound: "Message Sound",
        messageSoundDesc: "Play a sound when a response is received",
        showTimestamps: "Show Timestamps",
        showTimestampsDesc: "Display the time next to each message",
        autoScroll: "Auto-scroll",
        autoScrollDesc: "Automatically scroll to the latest message",
        compactMode: "Compact Mode",
        compactModeDesc: "Reduce spacing between messages",
        notifications: "Notifications",
        notifDesc: "Manage how you get notified.",
        emailNotif: "Email Notifications",
        emailNotifDesc: "Receive important updates via email",
        pushNotif: "Push Notifications",
        pushNotifDesc: "Browser push notifications for announcements",
        privacyData: "Privacy & Data",
        privacyDesc: "Control your data and privacy preferences.",
        saveChatHistory: "Save Chat History",
        saveChatHistoryDesc: "Store your conversations for future reference",
        shareUsage: "Share Usage Analytics",
        shareUsageDesc: "Help improve VPTC AI by sharing anonymous usage data",
        clearAllHistory: "Clear All Chat History",
        account: "Account",
        accountDesc: "Manage your account and profile.",
        editProfile: "Edit Profile",
        changePassword: "Change Password",
        signOut: "Sign Out",
        about: "About",
        aboutDesc: "Information about VPTC AI Chatbot.",
        saveChanges: "Save Changes",
        saved: "Saved!",

        // Chat page
        newChat: "New Chat",
        settings: "Settings",
        logout: "Logout",
        chatPlaceholder: "Ask about your college...",
        chatDisclaimer: "VPTC AI can make mistakes. Please verify important information.",
        freeTrialLimit: "Free trial limit reached. Please sign up to continue.",
        guestMode: "Guest Mode",
        loggedIn: "Logged In",
        profileSettings: "Profile Settings",
        exit: "Exit",
        greeting: "Hello! I am your Vignesh Polytechnic College (VPTC) AI Advisor. Ask me anything about our Diploma courses, admissions, or campus facilities.",
        translateToggle: "Switch to Tamil",

        // Starter prompts
        starterCourses: "Courses",
        starterCoursesPrompt: "What diploma courses do you offer?",
        starterAdmissions: "Admissions",
        starterAdmissionsPrompt: "Explain the admission process & eligibility.",
        starterFacilities: "Facilities",
        starterFacilitiesPrompt: "Tell me about the college library and sports facilities.",
        starterPlacements: "Placements",
        starterPlacementsPrompt: "What is the placement record of the college?",
    },
    Tamil: {
        // Settings – general
        appearance: "தோற்றம்",
        appearanceDesc: "VPTC AI உங்கள் சாதனத்தில் எவ்வாறு தெரிகிறது என்பதை தனிப்பயனாக்கவும்.",
        theme: "தீம்",
        chatFontSize: "சாட் எழுத்து அளவு",
        language: "மொழி",
        small: "சிறியது",
        medium: "நடுத்தரம்",
        large: "பெரியது",
        light: "வெளிர்",
        dark: "இருள்",
        system: "கணினி",
        chatAndAI: "சாட் & AI",
        chatDesc: "AI சாட் எவ்வாறு செயல்படுகிறது என்பதை கட்டுப்படுத்தவும்.",
        streamingResponses: "ஸ்ட்ரீமிங் பதில்கள்",
        streamingDesc: "AI பதிலை வார்த்தை வார்த்தையாக காட்டு",
        messageSound: "செய்தி ஒலி",
        messageSoundDesc: "பதில் கிடைக்கும் போது ஒலி இயக்கு",
        showTimestamps: "நேரமுத்திரை காட்டு",
        showTimestampsDesc: "ஒவ்வொரு செய்திக்கும் அருகில் நேரத்தை காட்டு",
        autoScroll: "தானியங்கி உருட்டல்",
        autoScrollDesc: "சமீபத்திய செய்திக்கு தானாக உருட்டு",
        compactMode: "சுருக்க பயன்முறை",
        compactModeDesc: "செய்திகளுக்கு இடையே இடைவெளியை குறைக்கவும்",
        notifications: "அறிவிப்புகள்",
        notifDesc: "எவ்வாறு அறிவிப்பு பெறுவீர்கள் என்பதை நிர்வகிக்கவும்.",
        emailNotif: "மின்னஞ்சல் அறிவிப்புகள்",
        emailNotifDesc: "மின்னஞ்சல் மூலம் முக்கியமான புதுப்பிப்புகளை பெறுங்கள்",
        pushNotif: "புஷ் அறிவிப்புகள்",
        pushNotifDesc: "அறிவிப்புகளுக்கு உலாவி புஷ் அறிவிப்புகள்",
        privacyData: "தனியுரிமை & தரவு",
        privacyDesc: "உங்கள் தரவு மற்றும் தனியுரிமை விருப்பங்களை கட்டுப்படுத்தவும்.",
        saveChatHistory: "சாட் வரலாற்றை சேமி",
        saveChatHistoryDesc: "எதிர்கால குறிப்பிற்காக உங்கள் உரையாடல்களை சேமிக்கவும்",
        shareUsage: "பயன்பாட்டு பகுப்பாய்வை பகிர்",
        shareUsageDesc: "அ익னாம் தரவை பகிர்ந்து VPTC AI ஐ மேம்படுத்த உதவுங்கள்",
        clearAllHistory: "அனைத்து சாட் வரலாற்றையும் அழி",
        account: "கணக்கு",
        accountDesc: "உங்கள் கணக்கு மற்றும் சுயவிவரத்தை நிர்வகிக்கவும்.",
        editProfile: "சுயவிவரத்தை திருத்து",
        changePassword: "கடவுச்சொல் மாற்று",
        signOut: "வெளியேறு",
        about: "பற்றி",
        aboutDesc: "VPTC AI Chatbot பற்றிய தகவல்.",
        saveChanges: "மாற்றங்களை சேமி",
        saved: "சேமிக்கப்பட்டது!",

        // Chat page
        newChat: "புதிய அரட்டை",
        settings: "அமைப்புகள்",
        logout: "வெளியேறு",
        chatPlaceholder: "உங்கள் கல்லூரி பற்றி கேளுங்கள்...",
        chatDisclaimer: "VPTC AI தவறுகள் செய்யலாம். முக்கியமான தகவல்களை சரிபார்க்கவும்.",
        freeTrialLimit: "இலவச சோதனை வரம்பை அடைந்தீர்கள். தொடர்வதற்கு பதிவு செய்யவும்.",
        guestMode: "விருந்தினர் பயன்முறை",
        loggedIn: "உள்நுழைந்தீர்கள்",
        profileSettings: "சுயவிவர அமைப்புகள்",
        exit: "வெளியேறு",
        greeting: "வணக்கம்! நான் உங்கள் Vignesh Polytechnic College (VPTC) AI ஆலோசகர். எங்கள் டிப்ளமா படிப்புகள், சேர்க்கை அல்லது வளாகம் பற்றி எதையும் கேளுங்கள்.",
        translateToggle: "English க்கு மாறு",

        // Starter prompts
        starterCourses: "படிப்புகள்",
        starterCoursesPrompt: "நீங்கள் எந்த டிப்ளமா படிப்புகளை வழங்குகிறீர்கள்?",
        starterAdmissions: "சேர்க்கை",
        starterAdmissionsPrompt: "சேர்க்கை செயல்முறை மற்றும் தகுதியை விளக்கவும்.",
        starterFacilities: "வசதிகள்",
        starterFacilitiesPrompt: "கல்லூரி நூலகம் மற்றும் விளையாட்டு வசதிகள் பற்றி சொல்லுங்கள்.",
        starterPlacements: "வேலைவாய்ப்பு",
        starterPlacementsPrompt: "கல்லூரியின் வேலைவாய்ப்பு சாதனை என்ன?",
    },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>("English");

    useEffect(() => {
        // Load saved language from settings
        try {
            const settings = JSON.parse(localStorage.getItem("vptc_settings") || "{}");
            const saved = settings.language as Language;
            if (saved === "Tamil" || saved === "English") {
                setLanguageState(saved);
            }
        } catch { }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        // Persist back into vptc_settings so settings page stays in sync
        try {
            const settings = JSON.parse(localStorage.getItem("vptc_settings") || "{}");
            settings.language = lang;
            localStorage.setItem("vptc_settings", JSON.stringify(settings));
        } catch { }
    };

    const t = (key: string): string =>
        TRANSLATIONS[language]?.[key] ?? TRANSLATIONS["English"][key] ?? key;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
    return context;
}
