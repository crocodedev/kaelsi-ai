import { PropsWithChildren } from "react";
import { Card } from "@/components/layouts/card";
import { useTranslation } from "@/hooks/useTranslation";
import { authActions, tarotActions, useAppDispatch } from "@/store";
import { TarotCategory } from "@/lib/types/astro-api";
import { useRouter } from "next/navigation";
import { tarotSlice } from "@/store/slices/tarot";
import { useAuth } from "@/hooks/useAuth";

type CardHistoryProps = PropsWithChildren & {
    category: TarotCategory;
}

export function CardHistory({ category }: CardHistoryProps) {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();

    const router = useRouter();

    const dispatch = useAppDispatch();


    const handleClick = async () => {
        if (!isAuthenticated) {
            dispatch(authActions.setIsOpenModal(true));
            return
        }

        await dispatch(tarotActions.setSelectedCategory(category));

        router.push(`/tarot?category=${category.id}`)
    }

    return (
        <Card className="h-8 min-w-fit cursor-pointer hover:scale-105 transition-all duration-300">
            <h3 onClick={handleClick} className="text-white  text-sm text-center text-wrap">
                {category.name}
            </h3>
        </Card>
    )
}