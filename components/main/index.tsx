import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type MainProps = PropsWithChildren<{
    className?: string
}>


export function Main({ children, className }: MainProps) {
    return (
        <main className={cn("w-full hide-scrollbar pt-28 pb-24 max-h-[100vh] overflow-x-hidden relative flex flex-col bg-mystical-bg text-mystical-text flex-1 overflow-auto", className)}>
            {children}
        </main>
    )
}