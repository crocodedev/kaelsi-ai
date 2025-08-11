
import { cn } from "@/lib/utils";
import { SubscriptionCardProps } from "../types";
import { useTranslation } from "@/hooks/useTranslation";




export function SubscriptionCard({ tier, title, price, originalPrice, className, benefits, tag, isSelected, onClick }: SubscriptionCardProps) {
    const { t } = useTranslation();

    return (
        <div
            className={cn(
                "relative p-6 rounded-xl ease-in-out gradient-dark-section border cursor-pointer transition-all duration-200", isSelected ? "gradient-purple-section" : "", className
            )}
            onClick={onClick}
        >
            {tag && (
                <div className={cn("absolute top-4 right-4 px-3 py-1  rounded-full", isSelected ? "bg-white" : "gradient-purple-section")}>
                    <span className={cn("text-black text-xs font-semibold", isSelected ? "text-gradient-purple" : "")}>{t(tag)}</span>
                </div>
            )}

            <div className="mb-4">
                <h3 className="text-white/70 text-sm font-semibold mb-2">{t(title)}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-white text-2xl font-bold">{price}</span>
                    <span className="text-white/50 text-sm line-through">{originalPrice}</span>
                </div>
            </div>

            <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                    <li key={index} className="text-white/70 text-sm flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{t(benefit)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}