import { PropsWithChildren } from "react"
import { cn } from "@/lib/utils"

export function Container({ children, className }: PropsWithChildren<{ className?: string }>) {
    return (
        <div className={cn("flex gap-[10px] w-full flex-wrap", className)}>
            {children}
        </div>
    )
}