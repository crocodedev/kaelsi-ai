import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { usePathname, useRouter } from "next/navigation";

export function useAndroidBackHandler() {
    const path = usePathname();
    const router = useRouter()

    useEffect(() => {
        CapacitorApp.addListener("backButton", ({ canGoBack }) => {
            if (path === "/" || path === "/home") {
                CapacitorApp.minimizeApp(); 
                return;
            }

            const navTabs = ["/tarot", "/quests", "/settings", "/profile"];
            if (navTabs.includes(path)) {
                router.push("/home");
                return;
            }

            if (canGoBack) {
                router.back();
            } else {
                CapacitorApp.minimizeApp();
            }
        });

    }, [router]);
}
