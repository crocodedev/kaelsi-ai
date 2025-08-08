import { NotifyProps } from "./types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Notify({ type, text }: NotifyProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className={cn(
            "fixed w-full flex justify-center items-center p-5 z-50 transition-all duration-300 ease-in-out",
            isVisible ? " translate-y-0" : " -translate-y-4"
        )}>
            <div className="w-90 gradient-dark-section w-full backdrop-blur-md rounded-xl flex items-center p-5">
                <span className="text-white text-sm">{text}</span>
            </div>
        </div>
    )
}