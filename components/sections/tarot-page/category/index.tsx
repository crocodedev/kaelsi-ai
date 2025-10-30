"use client"

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Icon, ICONS } from "@/components/ui/icon/Icon";
import { useTranslation } from "@/hooks/useTranslation";
import { TarotSpeaker } from "@/lib/types/astro-api";
import { cn } from "@/lib/utils";
import i18n from "@/lib/i18n";
import { tarotActions, useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";

let PREVIOUSLY_LANGUAGE = ''

export function Category() {
    const selectedReaderStyle = useAppSelector(state => state.tarot.readerStyle);
    const selectedReaderStyleName = selectedReaderStyle?.name
    const { t } = useTranslation();
    const { selectedCategory, selectedSpread } = useAppSelector(state => state.tarot)
    const dispatch = useAppDispatch();
    const speakers = useAppSelector(state => state.tarot.speakers);
    const response = useAppSelector(state => state.tarot.response);


    useEffect(() => {
        const fetchTarotSpeaker = async () => {
            if (speakers) return;
            await dispatch(tarotActions.getTarotSpeaker());
        }
        fetchTarotSpeaker();
    }, [dispatch]);

    
    useEffect(() => {
        const refetchTarotSpeaker = async () => {
            if (!speakers) return;
            if (PREVIOUSLY_LANGUAGE === i18n.language) return;
            await dispatch(tarotActions.getTarotSpeaker());
        }
        refetchTarotSpeaker();

        PREVIOUSLY_LANGUAGE = i18n.language;
    }, [i18n.language])

    const handleReaderStyleClick = (style: TarotSpeaker) => {
        dispatch(tarotActions.setReaderStyle(style));
    }

    if (!selectedCategory || !selectedSpread || response) {
        return null;
    }



    return (
        <div className="flex flex-col gap-4 mt-3">
            <p className="text-white text-sm">{t('tarot.category.readerStylePrompt')}</p>
            <Container className="flex justify-between">
                {speakers?.map((category, index) => {
                    const isSelected = selectedReaderStyleName === category.name;

                    return (

                        <Button
                            variant="black"
                            data-id={`Reader Style ${category.name}`}
                            key={category.id}
                            className={cn(
                                "flex flex-col py-4 px-1 justify-between items-center h-20 flex-1 text-xs text-white transition-all duration-300 hover:scale-105 hover:shadow-lg",
                                isSelected && "gradient-purple-transparent"
                            )}
                            onClick={handleReaderStyleClick.bind(null, category)}
                        >
                            <Icon width={20} height={20} svg={category.icon} />
                            {category.name}
                        </Button>
                    )
                })}
            </Container>
        </div>

    )
}