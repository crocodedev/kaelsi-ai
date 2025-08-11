import { Toggle } from "..";
import { cn } from "@/lib/utils";

interface OptionTogglerProps {
    title: string;
    description: string;
    className?:string;
}

export function OptionToggler({ title, description, className }: OptionTogglerProps) {
    return (
        <div className={cn("flex justify-between items-center", className)}>
            <div className="flex flex-col items-start gap-1">
                <h3 className="text-white text-sm">{title}</h3>
                <span className="text-white/70 text-xs">{description}</span>
            </div>
            <Toggle />
        </div>
    )
}