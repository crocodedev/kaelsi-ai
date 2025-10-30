"use client"

import { Button } from "@/components/ui/button";
import { tarotActions, useAppDispatch, useAppSelector } from "@/store";

import './styles.reset.css'
import { Icon } from "@/components/ui/icon/Icon";

export function SelectedData() {
    const selectedCategory = useAppSelector(state => state.tarot.selectedCategory)
    const response = useAppSelector(state => state.tarot.response)
    const slectedSpread = useAppSelector(state => state.tarot.selectedSpread)
    const dispatch = useAppDispatch();

    const handleClearSelectedCategory = () => {
        dispatch(tarotActions.setSelectedCategory(null))
        dispatch(tarotActions.setSelectedSpread(null))
    }

    const handleClearSelectedSpread = () => {
        dispatch(tarotActions.setSelectedSpread(null))
    }

    if (!selectedCategory && !slectedSpread) {
        return null;
    }

    return (
        <div className="flex gap-4 flex-wrap">
            {selectedCategory && (
                <Button
                    variant="secondary"
                    className="button-selected-data gradient-purple-section flex justify-between items-center max-w-fit p-3 pr-1  transition-all  duration-300 hover:scale-105 h-9"
                    onClick={handleClearSelectedCategory}
                >
                    <span className="text-black text-base text-nowrap">{selectedCategory.name}</span>
                    {!response && <Icon name='cross' />}
                </Button>
            )}
            {slectedSpread && (
                <Button
                    variant="secondary"
                    className="button-selected-data gradient-purple-section flex  justify-between items-center max-w-fit p-3 pr-1 transition-all  duration-300 hover:scale-105 h-9"
                    onClick={handleClearSelectedSpread}
                >
                    <span className="text-black text-base text-nowrap">{slectedSpread.name}</span>
                    {!response && <Icon name='cross' />}
                </Button>
            )}
        </div>
    )
}