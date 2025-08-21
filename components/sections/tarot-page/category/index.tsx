"use client"

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Icon, ICONS } from "@/components/ui/icon/Icon";
import { TarotSpeaker } from "@/lib/types/astro-api";
import { cn } from "@/lib/utils";
import { tarotActions, useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";

const CATEGORIES = [
    { id: '123', name: 'Analyst', icon: 'analyst' },
    { id: '124', name: 'Psychologist', icon: 'psychologist' },
    { id: '125', name: 'Friend', icon: 'friend' },
    { id: '126', name: 'Witch', icon: 'witch' }
]


export function Category() {
    const selectedReaderStyle = useAppSelector(state => state.tarot.readerStyle);
    const selectedReaderStyleName = selectedReaderStyle?.name
    const { selectedCategory, selectedSpread } = useAppSelector(state => state.tarot)
    const dispatch = useAppDispatch();
    const speakers = useAppSelector(state => state.tarot.speakers);
    const response = useAppSelector(state => state.tarot.response);


    useEffect(() => {
        const fetchTarotSpeaker = async () => {
            await dispatch(tarotActions.getTarotSpeaker());
        }
        fetchTarotSpeaker();
    }, [dispatch]);

    const handleReaderStyleClick = (style: TarotSpeaker) => {
        dispatch(tarotActions.setReaderStyle(style));
    }

    if (!selectedCategory || !selectedSpread || response) {
        return null;
    }

   

    return (
        <div className="flex flex-col gap-4 mt-3">
            <p className="text-white text-sm">Choose a Tarot Reader Style:</p>
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