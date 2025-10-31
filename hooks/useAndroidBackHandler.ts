import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { usePathname, useRouter } from "next/navigation";
import { uiActions, useAppDispatch } from "@/store";

export function useAndroidBackHandler() {
  const path = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    let listenerRef: any;

    const setupListener = async () => {
      listenerRef = await CapacitorApp.addListener("backButton", ({ canGoBack }) => {
        if (path === "/" || path === "/home") {
          CapacitorApp.minimizeApp();
          return;
        }

        const navTabs = ["/tarot", "/quests", "/settings", "/profile"];
        if (navTabs.includes(path)) {
            dispatch(uiActions.setActiveNavigationItem('home'))
          router.push("/home");

          return;
        }

        if (canGoBack) {
          router.back();
        } else {
          CapacitorApp.minimizeApp();
        }
      });
    };

    setupListener();

    return () => {
      if (listenerRef) {
        listenerRef.remove();
      }
    };
  }, [path, router]);
}
