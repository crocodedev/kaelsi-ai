import { cn } from "@/lib/utils"

export function SectionTitle({ title, className }: { title: string, className?: string }) {
    return (
        <div className={cn("flex w-full justify-end mb-6", className)}>
            <span className="text-gradient text-xl text-end">{title}</span>
        </div>
    )
}
