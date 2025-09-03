import { Icon, ICONS } from "@/components/ui/icon/Icon";
import { Card } from "@/components/layouts/card";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";

type CardExploreProps = {
    title: string;
    icon: keyof typeof ICONS;
    link: string;
    className?: string;
}

export function CardExplore({ title, icon, link, className }: CardExploreProps) {
    const { t } = useTranslation();
    const router = useRouter();

    const handleClick = () => {
        router.push(link)
    }


    return (
        <Card className={`cursor-pointer h-[80px] hover:scale-105 transition-all duration-300   ${className}`} onClick={handleClick}>
            <div className="flex flex-col items-center justify-center gap-2">
                <Icon name={icon} height={20} width={20} />
                <h2 className="text-white text-sm text-center text-wrap">{t(title)}</h2>
            </div>
        </Card>
    )
}