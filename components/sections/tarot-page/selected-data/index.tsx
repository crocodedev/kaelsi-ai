"use client"

import { Button } from "@/components/ui/button";
import { tarotActions, useAppDispatch, useAppSelector } from "@/store";
import { cn } from "@/lib/utils";

export function SelectedData() {
    const selectedCategory = useAppSelector(state => state.tarot.selectedCategory)
    const slectedSpread = useAppSelector(state => state.tarot.selectedSpread)
    const dispatch = useAppDispatch();

    const handleClearSelectedCategory = () => {
        dispatch(tarotActions.setSelectedCategory(null))
    }

    const handleClearSelectedSpread = () => {
        dispatch(tarotActions.setSelectedSpread(null))
    }

    if(!selectedCategory && !slectedSpread){
        return null;
    }

    return (
        <div className="flex gap-4 min-h-[48px]">
            {selectedCategory && (
                <Button
                    variant="secondary"
                    className="gradient-purple-section flex justify-between items-center max-w-fit p-3 transition-all duration-300 hover:scale-105"
                    onClick={handleClearSelectedCategory}
                >
                    <span className="text-black text-sm">{selectedCategory.name}</span>
                    <span className="text-black text-sm ml-2">×</span>
                </Button>
            )}
            {slectedSpread && (
                <Button
                    variant="secondary"
                    className="gradient-purple-section flex justify-between items-center max-w-fit p-3 transition-all duration-300 hover:scale-105"
                    onClick={handleClearSelectedSpread}
                >
                    <span className="text-black text-sm">{slectedSpread.name}</span>
                    <span className="text-black text-sm ml-2">×</span>
                </Button>
            )}
        </div>
    )
}