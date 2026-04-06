"use client";

import { useEffect } from "react";

/**
 * Reads the saved font-size setting from localStorage on mount
 * and applies the corresponding class to <html> so it persists
 * across all pages without needing to visit Settings first.
 */
export default function SettingsApplier() {
    useEffect(() => {
        try {
            const settings = JSON.parse(localStorage.getItem("vptc_settings") || "{}");
            const fontSize: string = settings.fontSize || "Medium";
            const html = document.documentElement;
            html.classList.remove("font-size-small", "font-size-medium", "font-size-large");
            html.classList.add(`font-size-${fontSize.toLowerCase()}`);
        } catch {
            // Silently ignore parse errors
        }
    }, []);

    return null; // renders nothing
}
