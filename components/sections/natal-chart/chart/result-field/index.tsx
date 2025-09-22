import { Icon } from "@/components/ui/icon/Icon";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { formatTextWithMarkdown } from "@/lib/utils/format-text-with-markdown";

type ResultFieldProps = {
    category: string;
    answer: string;
}

export function ResultField({ category, answer }: ResultFieldProps) {
    const formattedAnswer = formatTextWithMarkdown(answer);
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="flex flex-col gap-2">
            <div className="option-field rounded-xl px-5 py-3 flex justify-between items-center shadow-section cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <h3 className="text-white text-sm text-center">{category}</h3>
                <Icon name="chevron" className={cn("w-4 h-4 transition-transform duration-300", isOpen ? "" : "rotate-180")} />
            </div>
            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}>
                <div 
                    className={'text-white/70 text-sm text-start text-wrap py-2'}
                    dangerouslySetInnerHTML={{ __html: formattedAnswer }}
                />
            </div>
        </div>
    )
}