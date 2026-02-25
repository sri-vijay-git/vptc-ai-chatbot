"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// /signup now redirects to the combined Login + Sign Up page at /login
export default function SignupRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/login");
    }, [router]);
    return null;
}
