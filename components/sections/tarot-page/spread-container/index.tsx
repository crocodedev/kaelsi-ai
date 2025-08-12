"use client"

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { tarotActions, useAppDispatch, useAppSelector } from "@/store";

const SPREADS = ['Relationship Dynamic', 'Trust', 'Future', 'Helping Each Other', 'Possible conflicts']

export function SpreadContainer() {
    const slectedSpread = useAppSelector(state => state.tarot.selectedSpread)
    const slectedCategory = useAppSelector(state => state.tarot.selectedCategory)

    const dispatch = useAppDispatch();

    const handleSpreadClick = (spread: string) => {
        dispatch(tarotActions.setSelectedSpread(spread));
    }

    if (slectedSpread) {
        return null;
    }

    if (!slectedCategory) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <p className="text-white text-sm animate-fade-in">Select a spread topic:</p>
            <Container>
                {SPREADS.map((spread, index) => {
                    return (
                        <Button
                            variant="secondary"
                            onClick={handleSpreadClick.bind(null, spread)}
                            className={cn(
                                "text-white max-w-fit p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg",
                                slectedSpread === spread && "gradient-purple-section"
                            )}
                        >
                            {spread}
                        </Button>
                    )
                })}
            </Container>
        </div>
    )
}