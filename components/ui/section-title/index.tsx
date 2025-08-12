import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react";

type SectionTitleProps = PropsWithChildren<{
    className?: string;
    anchor?: 'left' | 'right';
}>

export function SectionTitle({ children, className, anchor = 'right' }: SectionTitleProps) {
    return (
        <div className={cn(`flex w-full justify-end mb-6 ${anchor === 'left' ? 'justify-start' : 'justify-end'}`, className)}>
            <span className={cn("text-gradient text-xl")}>{children}</span>
        </div>
    )
}
