"use client"

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { TarotCategory } from "@/lib/types/astro-api";
import { cn } from "@/lib/utils";
import { tarotActions, useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";


export function ThemeContainer() {
    const selectedCategory = useAppSelector(state => state.tarot.selectedCategory)
    const selectedCategoryName = selectedCategory?.name
    const categories = useAppSelector(state => state.tarot.categories)

    const dispatch = useAppDispatch();


    const handleThemeClick = (theme: TarotCategory) => {
        dispatch(tarotActions.setSelectedCategory(theme))
    }

    useEffect(() => {
        const fetchCategories = async () => {
            await dispatch(tarotActions.getTarotCategories({ page: 1, per_page: 20 }))
        }
        fetchCategories()
    }, [dispatch])


    if (selectedCategory) {
        return null;
    }


    if(!categories){
        return <Loader />
    }


    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-white text-sm animate-fade-in">Choose a theme for your reading:</h3>
            <p className="text-white/70 text-sm "> Whether you're seeking advice on love, career, or personal growth, our Tarot readings will illuminate your path</p>

            <Container className="flex flex-wrap gap-4 justify-start">
                {categories.map((theme) => {
                    const isSelected = selectedCategoryName === theme.name;
                    if(!theme.name) return;
                    
                    return (
                        <Button
                            key={theme.id}
                            data-id={`Category ${theme.name}`}
                            variant="secondary"
                            onClick={handleThemeClick.bind(null, theme)}
                            className={cn(
                                "text-nowrap max-w-fit px-5 py-1 transition-all duration-300 hover:scale-105 hover:shadow-lg",
                                isSelected && "text-black gradient-purple-section"
                            )}
                        >
                            {theme.name}
                        </Button>
                    )
                })}
            </Container>
        </div>
    )
}