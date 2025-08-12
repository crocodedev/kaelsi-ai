import { PropsWithChildren } from "react"
import { cn } from "@/lib/utils"
import { useCardSpeed } from "@/hooks/useCardSpeed";

type SectionLayoutProps = PropsWithChildren & {
    className?: string;
}

export function Section({ children, className }: SectionLayoutProps) {
    const { style } = useCardSpeed();
    
    return (
        <div style={style} className={cn("animate-fade-in m-5 mb-1 rounded-xl p-5 bg-section-gradient/90 gradient-dark-section shadow-section backdrop-blur-md border border-black/20 ", className)}>
            {children}
        </div>
    )
}