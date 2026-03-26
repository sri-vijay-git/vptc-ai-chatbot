"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const handleOAuthCallback = () => {
            try {
                const hash = window.location.hash.substring(1);
                const params = new URLSearchParams(hash);

                const accessToken = params.get('access_token');
                const refreshToken = params.get('refresh_token');

                if (accessToken) {
                    localStorage.setItem('token', accessToken);
                    if (refreshToken) {
                        localStorage.setItem('refresh_token', refreshToken);
                    }

                    // Decode JWT to extract user info for localStorage
                    try {
                        const parts = accessToken.split('.');
                        if (parts.length === 3) {
                            const payload = JSON.parse(atob(parts[1]));
                            const meta = payload.user_metadata || {};
                            localStorage.setItem('user', JSON.stringify({
                                id: payload.sub,
                                email: payload.email || meta.email || '',
                                full_name: meta.full_name || meta.name || payload.email?.split('@')[0] || 'Student',
                                role: meta.role || 'student',
                                avatar_url: meta.avatar_url || meta.picture || null,
                            }));
                        }
                    } catch {
                        // If JWT decode fails, store minimal info
                        localStorage.setItem('user', JSON.stringify({ role: 'student' }));
                    }

                    window.dispatchEvent(new Event('auth-change'));
                    router.push('/');
                } else {
                    router.push('/login?error=auth_failed');
                }
            } catch (error) {
                console.error('OAuth callback error:', error);
                router.push('/login?error=auth_error');
            }
        };

        handleOAuthCallback();
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <div className="mb-4">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Completing sign in...
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Please wait while we log you in
                </p>
            </div>
        </div>
    );
}
