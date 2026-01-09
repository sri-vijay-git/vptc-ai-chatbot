// Guest Mode Hook - Allows 3 free conversations without login

import { useState, useEffect } from 'react';

const GUEST_LIMIT = 3;
const STORAGE_KEY = 'vptc_guest_conversations';

export function useGuestMode() {
    const [conversationCount, setConversationCount] = useState(0);
    const [isGuest, setIsGuest] = useState(true);
    const [showSignupPrompt, setShowSignupPrompt] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            setIsGuest(false);
            return;
        }

        // Get guest conversation count
        const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
        setConversationCount(count);

        // Show signup prompt if limit reached
        if (count >= GUEST_LIMIT) {
            setShowSignupPrompt(true);
        }
    }, []);

    const incrementConversation = () => {
        if (!isGuest) return true; // Logged in users have unlimited

        const newCount = conversationCount + 1;
        setConversationCount(newCount);
        localStorage.setItem(STORAGE_KEY, newCount.toString());

        if (newCount >= GUEST_LIMIT) {
            setShowSignupPrompt(true);
            return false; // Limit reached
        }

        return true; // Can continue
    };

    const resetGuestData = () => {
        localStorage.removeItem(STORAGE_KEY);
        setConversationCount(0);
        setShowSignupPrompt(false);
    };

    const getRemainingConversations = () => {
        if (!isGuest) return Infinity;
        return Math.max(0, GUEST_LIMIT - conversationCount);
    };

    const canChat = () => {
        if (!isGuest) return true;
        return conversationCount < GUEST_LIMIT;
    };

    return {
        isGuest,
        conversationCount,
        showSignupPrompt,
        incrementConversation,
        resetGuestData,
        getRemainingConversations,
        canChat,
        guestLimit: GUEST_LIMIT,
    };
}
