"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { Main } from "@/components/main";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/store";
import { selectHasToken } from "@/store/selectors/auth";

export default function AuthPage() {
    const router = useRouter();
    const hasToken = useAppSelector(selectHasToken);
    

    useEffect(() => {
        if (hasToken) {
            router.push('/');
        }
    }, [hasToken, router]);

    const handleAuthSuccess = () => {
        router.push('/');
    };

    if (hasToken) {
        return null;
    }

    return (
        <Main className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="text-2xl font-bold text-white">Welcome to Kaelis</h1>
            <AuthForm onSuccess={handleAuthSuccess} />
        </Main>
    );
} 