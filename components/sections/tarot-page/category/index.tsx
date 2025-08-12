"use client"

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Icon, ICONS } from "@/components/ui/icon/Icon";
import { cn } from "@/lib/utils";
import { tarotActions, useAppDispatch, useAppSelector } from "@/store";

const CATEGORIES = [
    { id: '123', name: 'Analyst', icon: 'analyst' },
    { id: '124', name: 'Psychologist', icon: 'psychologist' },
    { id: '125', name: 'Friend', icon: 'friend' },
    { id: '126', name: 'Witch', icon: 'witch' }
]


export function Category() {
    const selectedReaderStyle = useAppSelector(state => state.tarot.readerStyle);
    const { selectedCategory, selectedSpread } = useAppSelector(state => state.tarot)
    const dispatch = useAppDispatch();

    const handleReaderStyleClick = (style: string) => {
        dispatch(tarotActions.setReaderStyle(style));
    }

    if (!selectedCategory || !selectedSpread) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4 mt-3">
            <p className="text-white text-sm">Choose a Tarot Reader Style:</p>
            <Container className="flex justify-between">
                {CATEGORIES.map((category, index) => {
                    const isSelected = selectedReaderStyle === category.name;
                    return (

                        <Button
                            variant="black"
                            className={cn(
                                "flex flex-col py-4 px-1 justify-between items-center h-20 flex-1 text-xs text-white transition-all duration-300 hover:scale-105 hover:shadow-lg",
                                isSelected && "gradient-purple-transparent"
                            )}
                            onClick={handleReaderStyleClick.bind(null, category.name)}
                        >
                            <Icon width={20} height={20} name={category.icon as keyof typeof ICONS} />
                            {category.name}
                        </Button>
                    )
                })}
            </Container>
        </div>

    )
}