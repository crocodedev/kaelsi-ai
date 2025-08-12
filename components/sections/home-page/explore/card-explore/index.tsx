import { Icon, ICONS } from "@/components/ui/icon/Icon";
import { Card } from "@/components/layouts/card";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";

interface CardExploreProps {
    title: string;
    icon: keyof typeof ICONS;
    link: string;
}

export function CardExplore({ title, icon, link }: CardExploreProps) {
    const { t } = useTranslation();
    const router = useRouter();
    
    return (
        <Card className="cursor-pointer" onClick={() => router.push(link)}>
            <div className="flex flex-col items-center justify-center gap-2">
                <Icon name={icon} height={20} width={20} />
                <h2 className="text-white text-sm text-center text-wrap">{t(title)}</h2>
            </div>
        </Card>
    )
}