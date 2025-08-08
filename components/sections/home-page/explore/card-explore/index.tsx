import { Icon, ICONS } from "@/components/ui/icon/Icon";
import { Card } from "@/components/layouts/card";
import { useTranslation } from "@/hooks/useTranslation";

interface CardExploreProps {
    title: string;
    icon: keyof typeof ICONS;
}

export function CardExplore({ title, icon }: CardExploreProps) {
    const { t } = useTranslation();
    
    return (
        <Card>
            <div className="flex flex-col items-center justify-center gap-2">
                <Icon name={icon} height={20} width={20} />
                <h2 className="text-white text-sm text-center text-wrap">{t(title)}</h2>
            </div>
        </Card>
    )
}