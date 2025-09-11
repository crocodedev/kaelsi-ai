import { Section } from "@/components/layouts/section";
import { SpreadContainer } from "@/components/sections/tarot-page/spread-container";
import { ThemeContainer } from "@/components/sections/tarot-page/theme-container";
import { SelectedData } from "./selected-data";
import { SectionTitle } from "@/components/ui/section-title";
import { Category } from "./category";
import { Chat } from "./chat";
import { Chart } from "./chart";
import { tarotActions, useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";
import i18n from "@/lib/i18n";
import { useTranslation } from "@/hooks/useTranslation";

export function TarotReading() {
    const lastTarotId = useAppSelector(state => state.user.lastTarotId);
    const response = useAppSelector(state => state.tarot.response);
    const { t } = useTranslation()

    const dispatch = useAppDispatch();

    const fetchTarotByLastId = async () => {
        if (!lastTarotId || response) return;

        await dispatch(tarotActions.getTarotById(lastTarotId))
    }

    useEffect(() => {
        fetchTarotByLastId();
    }, [i18n.language])

    return (
        <Section className="flex flex-col gap-4 one-page-section overflow-scroll hide-scrollbar">
            <SectionTitle className="mb-0">{t('tarot.title')}</SectionTitle>
            <SelectedData />
            {!lastTarotId && <ThemeContainer />}
            {!lastTarotId && <SpreadContainer />}
            {!lastTarotId && <Category />}
            {!lastTarotId && <Chat />}

            <Chart />
        </Section>
    )
}