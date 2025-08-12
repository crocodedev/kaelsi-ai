import { PropsWithChildren } from "react"
import { cn } from "@/lib/utils"

type SectionLayoutProps = PropsWithChildren & {
    className?: string;
}

export function Section({ children, className }: SectionLayoutProps) {
    return (
        <div className={cn("animate-fade-in m-5 mb-1 rounded-xl p-5 bg-section-gradient/90 gradient-dark-section shadow-section backdrop-blur-md border border-black/20 ", className)}>
            {children}
        </div>
    )
}