import { PropsWithChildren } from "react";
import { Card } from "@/components/layouts/card";
import { useTranslation } from "@/hooks/useTranslation";

type CardHistoryProps = PropsWithChildren & {
    text: string;
}

export function CardHistory({ text }: CardHistoryProps) {
    const { t } = useTranslation();
    
    return (
        <Card className="h-8 min-w-16 max-w-min">
            <h3 className="text-white text-sm text-center text-wrap">
                {t(text)}
            </h3>
        </Card>
    )
}