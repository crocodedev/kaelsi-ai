"use client"

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import i18n from "@/lib/i18n";
import { TarotCard } from "@/lib/types/astro-api";
import { cn } from "@/lib/utils";
import { tarotActions, useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";

const SPREADS = [{
    name: 'Relationship Dynamic',
    id: "1213",
    description: "Relationship Dynamic",
    matrix: "1213",
    image: "1213",
}]

export function SpreadContainer() {
    const slectedSpread = useAppSelector(state => state.tarot.selectedSpread)
    const slectedCategory = useAppSelector(state => state.tarot.selectedCategory)
    const spreads = useAppSelector(state => state.tarot.spreads)
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const handleSpreadClick = (spread: TarotCard) => {
        dispatch(tarotActions.setSelectedSpread(spread));
    }

    useEffect(() => {
        const fetchSpreads = async () => {
            if (spreads) return;
            await dispatch(tarotActions.getTarotSpreads(slectedCategory));
        }
        fetchSpreads()
    }, [dispatch, slectedCategory])

    useEffect(() => {
        const refetchCategories = async () => {
            if (spreads) return;
            await dispatch(tarotActions.getTarotSpreads(slectedCategory))
        }
        refetchCategories();
    }, [i18n.language])

    if (slectedSpread) {
        return null;
    }

    if (!slectedCategory || !spreads) {
        return null;
    }





    return (
        <div className="flex flex-col gap-4">
            <p className="text-white text-sm animate-fade-in">{t('tarot.spreads.selectTopic')}</p>
            <Container>
                {spreads.map((spread, index) => {
                    return (
                        <Button
                            key={index}
                            data-id={`Spread ${spread.name}`}
                            variant="secondary"
                            onClick={handleSpreadClick.bind(null, spread)}
                            className={cn(
                                "text-white max-w-fit p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg",
                                slectedSpread === spread.name && "gradient-purple-section"
                            )}
                        >
                            {spread.name}
                        </Button>
                    )
                })}
            </Container>
        </div>
    )
}