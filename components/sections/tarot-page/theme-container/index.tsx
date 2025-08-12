"use client"

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { tarotActions, useAppDispatch, useAppSelector } from "@/store";

const THEMES = ['Love', 'Friends', 'Money', 'Kids', 'Investments', 'Problems in life', 'Health', 'Talent', 'Job']


export function ThemeContainer() {
    const selectedTheme = useAppSelector(state => state.tarot.selectedCategory)
    const dispatch = useAppDispatch();


    const handleThemeClick = (theme: string) => {
        dispatch(tarotActions.setSelectedCategory(theme))
    }


    if (selectedTheme) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-white text-sm animate-fade-in">Choose a theme for your reading:</h3>
            <p className="text-white/70 text-sm "> Whether you're seeking advice on love, career, or personal growth, our Tarot readings will illuminate your path</p>

            <Container className="flex flex-wrap gap-4 justify-start">
                {THEMES.map((theme, index) => {
                    const isSelected = selectedTheme === theme;

                    return (
                        <Button
                            variant="secondary"
                            onClick={handleThemeClick.bind(null, theme)}
                            className={cn(
                                "text-nowrap max-w-fit px-5 py-1 transition-all duration-300 hover:scale-105 hover:shadow-lg",
                                isSelected && "text-black gradient-purple-section"
                            )}
                        >
                            {theme}
                        </Button>
                    )
                })}
            </Container>
        </div>
    )
}