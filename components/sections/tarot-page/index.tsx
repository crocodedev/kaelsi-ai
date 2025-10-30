import { Section } from "@/components/layouts/section";
import { SpreadContainer } from "@/components/sections/tarot-page/spread-container";
import { ThemeContainer } from "@/components/sections/tarot-page/theme-container";
import { SelectedData } from "./selected-data";
import { SectionTitle } from "@/components/ui/section-title";
import { Category } from "./category";
import { Chat } from "./chat";
import { Chart } from "./chart";
import { tarotActions, useAppDispatch, useAppSelector, userActions } from "@/store";
import { useEffect } from "react";
import i18n from "@/lib/i18n";
import { useTranslation } from "@/hooks/useTranslation";
import { useNotify } from "@/providers/notify-provider";
import { cn } from "@/lib/utils";

let PREVIOUSLY_LANGUAGE = ''


export function TarotReading() {
    const lastTarotId = useAppSelector(state => state.user.lastTarotId);
    const response = useAppSelector(state => state.tarot.response);
    const { notify } = useNotify();
    const { t } = useTranslation()

    const dispatch = useAppDispatch();

    const refetchTarot = async () => {
        if (!lastTarotId || !response) return;
        if (PREVIOUSLY_LANGUAGE === i18n.language) return;

        await dispatch(tarotActions.getTarotById(lastTarotId))
    }

    useEffect(() => {
        refetchTarot();

        PREVIOUSLY_LANGUAGE = i18n.language;
    }, [i18n.language])

    useEffect(() => {
        const handleRejected = async () => {
            if (response?.reading?.status === 'reject') {
                notify('error', response?.reading?.suggestion || t('common.error'))
                await dispatch(tarotActions.clearChart())
                await dispatch(userActions.clearLastTarot())
            }
        }
        handleRejected()
    }, [response?.reading?.status])


    useEffect(() => {
        const handleClear = async () => {
            await dispatch(tarotActions.clearChart())
        }

        return () => {
            if (!response) {
                handleClear()
            }
        }
    }, [])

    return (
        <Section className={cn("flex flex-col h-min gap-4 overflow-scroll pb-6 hide-scrollbar", response && "one-page-section")}>
            <SectionTitle className="mb-0">{t('tarot.title')}</SectionTitle>
            <SelectedData />
            {!response && <>
                <ThemeContainer />
                <SpreadContainer />
                <Category />
            </>
            }
            <Chat />
            <Chart />
        </Section>
    )
}