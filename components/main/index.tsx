'use client'

import { NAV_ITEMS } from "@/lib/const";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type MainProps = {
    children: React.ReactNode;
    className?: string;
};

export function Main({ children, className }: MainProps) {
    const pathname = usePathname();
    const [bg, setBg] = useState<string | null>(null);

    useEffect(() => {
        const matched = NAV_ITEMS.find((i) => i.link === pathname);
        const nextBg = matched?.background.src ?? NAV_ITEMS.find(i => i.id === "home")!.background.src;

        const img = new Image();
        img.src = nextBg;
        img.onload = () => setBg(nextBg);
    }, [pathname]);

    return (
        <main
            className={cn(
                "w-full hide-scrollbar pt-28 pb-24 max-h-[100vh] overflow-x-hidden relative flex flex-col text-mystical-text flex-1 overflow-auto bg-mystical-bg transition-colors duration-300",
                className
            )}
            style={{
                backgroundImage: bg ? `url(${bg})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "background-image 0.3s ease-in-out",
            }}
        >
            <div
                className="absolute inset-0 bg-mystical-bg opacity-100 transition-opacity duration-500"
                style={{ opacity: bg ? 0 : 1 }}
            />

            {children}
        </main>
    );
}
