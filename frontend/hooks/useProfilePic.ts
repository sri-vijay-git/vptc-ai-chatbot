import { useState, useEffect } from "react";

/**
 * Shared hook that reads the profile picture from localStorage.
 * Each user's picture is stored under key `profile_pic_<email>`.
 * Falls back to the generic `profile_pic` key for backward compatibility.
 */
export function useProfilePic(): string | null {
    const [profilePic, setProfilePic] = useState<string | null>(null);

    useEffect(() => {
        const load = () => {
            // Try to get per-user key first
            const userStr = localStorage.getItem("user");
            let pic: string | null = null;
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    const email = user.email;
                    if (email) {
                        pic = localStorage.getItem(`profile_pic_${email}`);
                    }
                } catch { /* ignore */ }
            }
            // Fallback to legacy key
            if (!pic) pic = localStorage.getItem("profile_pic");
            setProfilePic(pic);
        };

        load();

        // Re-sync when profile pic is saved in another tab or component
        window.addEventListener("storage", load);
        window.addEventListener("profile-pic-change", load);
        return () => {
            window.removeEventListener("storage", load);
            window.removeEventListener("profile-pic-change", load);
        };
    }, []);

    return profilePic;
}

/**
 * Save the profile picture for the current user.
 * Stores under `profile_pic_<email>` AND the legacy `profile_pic` key.
 */
export function saveProfilePic(dataUrl: string) {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.email) {
                localStorage.setItem(`profile_pic_${user.email}`, dataUrl);
            }
        } catch { /* ignore */ }
    }
    localStorage.setItem("profile_pic", dataUrl);
    window.dispatchEvent(new Event("profile-pic-change"));
}

/**
 * Remove the profile picture for the current user.
 */
export function removeProfilePic() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.email) {
                localStorage.removeItem(`profile_pic_${user.email}`);
            }
        } catch { /* ignore */ }
    }
    localStorage.removeItem("profile_pic");
    window.dispatchEvent(new Event("profile-pic-change"));
}
