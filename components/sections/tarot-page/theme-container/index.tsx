"use client"

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import i18n from "@/lib/i18n";
import { TarotCategory } from "@/lib/types/astro-api";
import { cn } from "@/lib/utils";
import { authActions, tarotActions, useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";

let PREVIOUSLY_LANGUAGE = ''


export function ThemeContainer() {
    const selectedCategory = useAppSelector(state => state.tarot.selectedCategory)
    const selectedCategoryName = selectedCategory?.name
    const { isAuthenticated } = useAuth();
    const categories = useAppSelector(state => state.tarot.categories)
    const { t } = useTranslation();
    const dispatch = useAppDispatch();


    const handleThemeClick = (theme: TarotCategory) => {
        if (!isAuthenticated) {
            dispatch(authActions.setIsOpenModal(true));
            return;
        }
        dispatch(tarotActions.setSelectedCategory(theme))
    }

    useEffect(() => {
        const fetchCategories = async () => {
            if (categories && categories?.length > 7) return;
            await dispatch(tarotActions.getTarotCategories({ page: 1, per_page: 20 }))
        }
        fetchCategories()
    }, [dispatch])


    useEffect(() => {
        const refetchCategories = async () => {
            if (!categories) return;
            if (PREVIOUSLY_LANGUAGE === i18n.language) return;
            const response = (await dispatch(tarotActions.getTarotCategories({ page: 1, per_page: 20 }))).payload as TarotCategory[];
            const newSelectedCategory = response.find(category => category.id == selectedCategory?.id) || null;
            await dispatch(tarotActions.setSelectedCategory(newSelectedCategory))
        }
        refetchCategories();

        PREVIOUSLY_LANGUAGE = i18n.language;

    }, [i18n.language])


    if (selectedCategory) {
        return null;
    }


    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-white text-sm animate-fade-in">{t('tarot.theme.select')}</h3>
            <p className="text-white/70 text-sm "> {t('tarot.theme.description')}</p>

            <Container className="flex flex-wrap gap-4 justify-start">
                {categories && categories.map((theme) => {
                    const isSelected = selectedCategoryName === theme.name;
                    if (!theme.name) return;

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