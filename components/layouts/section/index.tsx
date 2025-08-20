import { PropsWithChildren } from "react"
import { cn } from "@/lib/utils"
import { useCardSpeed } from "@/hooks/useCardSpeed";

type SectionLayoutProps = PropsWithChildren & {
    className?: string;
    isNeedBackground?: boolean;
}

export function Section({ children, className, isNeedBackground = true }: SectionLayoutProps) {
    const { style } = useCardSpeed();

    const background = isNeedBackground ? "bg-section-gradient/90 gradient-dark-section shadow-section backdrop-blur-md border border-black/20" : ""
    
    return (
        <section style={style} className={cn("animate-fade-in m-5 mb-1 rounded-xl p-5 ", background, className)}>
            {children}
        </section>
    )
}