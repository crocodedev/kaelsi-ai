import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type MainProps = PropsWithChildren<{
    className?: string
}>


export function Main({ children, className }: MainProps) {
    return (
        <main className={cn("w-full h-full relative flex flex-col bg-mystical-bg text-mystical-text flex-1 overflow-auto pb-20", className)}>
            {children}
        </main>
    )
}