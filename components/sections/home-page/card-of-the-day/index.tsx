import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { useTranslation } from "@/hooks/useTranslation";
import { astroActions, useAppDispatch, useAppSelector } from "@/store";
import Image from "next/image";

import { useEffect } from "react";

export function CardOfTheDay() {
    const { t } = useTranslation()
    const cardDay = useAppSelector(state => state.astro.cardDay);
    const dispatch = useAppDispatch();

    const url = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '/image') + '/decks/' + cardDay?.img_front 


    useEffect(() => {
        if (!cardDay) {
            dispatch(astroActions.getCardDay());
        }
    }, [dispatch, cardDay]);

    return (
        <Section className="flex gap-[15px] m-0">
            <div className="w-2/5">
                <Image 
                  src={url} 
                  alt={cardDay?.name || ''} 
                  width={100} 
                  height={100} 
                  className="w-full h-full"
                  unoptimized
                />
            </div>
            <div className="w-3/5">
                <SectionTitle >{t(cardDay?.name || "card-of-the-day.title")}</SectionTitle>
                <div className="flex flex-col gap-3">
                    <p className="text-white text-sm">{t('card-of-the-day.subtitle')}</p>
                    <p className="text-white/70 text-sm">{t('card-of-the-day.description')}</p>
                    <p className="text-white/70 text-sm">{t('card-of-the-day.description-2')}</p>
                </div>
            </div>
        </Section>
    )
}