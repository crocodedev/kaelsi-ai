"use client"

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { tarotActions, useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";

const SPREADS = [{
    name: 'Relationship Dynamic',
    id:"1213",
    description: "Relationship Dynamic",
    matrix: "1213",
}]

export function SpreadContainer() {
    const slectedSpread = useAppSelector(state => state.tarot.selectedSpread)
    const slectedCategory = useAppSelector(state => state.tarot.selectedCategory)
    const spreads = useAppSelector(state => state.tarot.spreads)

    const dispatch = useAppDispatch();

    const handleSpreadClick = (spread: string) => {
        dispatch(tarotActions.setSelectedSpread(spread));
    }

    useEffect(() => {
        const fetchSpreads = async () => {
           await dispatch(tarotActions.getTarotSpreads());
        }
        fetchSpreads()
    }, [dispatch])

    if (slectedSpread) {
        return null;
    }

    if (!slectedCategory) {
        return null;
    }

    const DATA = spreads && spreads.length > 0 ? spreads : SPREADS;

    return (
        <div className="flex flex-col gap-4">
            <p className="text-white text-sm animate-fade-in">Select a spread topic:</p>
            <Container>
                {DATA.map((spread, index) => {
                    return (
                        <Button
                            variant="secondary"
                            onClick={handleSpreadClick.bind(null, spread.name)}
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