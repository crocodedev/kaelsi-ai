"use client"
import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { useTranslation } from "@/hooks/useTranslation";
import { astroActions, authActions, useAppDispatch, useAppSelector } from "@/store";
import Image from "next/image";
import BackgroundImage from "@/assets/cards/background-card.jpg"
import { memo, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import i18n from "@/lib/i18n";

let PREVIOUSLY_LANGUAGE = '';

function CardOfTheDay() {
    const { t } = useTranslation()
    const { isAuthenticated } = useAuth();
    const dispatch = useAppDispatch();
    const cardDay = useAppSelector(state => state.astro.cardDay);
    const isLoading = useAppSelector(state => state.astro.loading);
    const [hydrated, setHydrated] = useState(false);
    const [loadImage, setLoadImage] = useState(false);

    useEffect(() => {
        if (isAuthenticated)
            setHydrated(true);
        setTimeout(() => {
            setHydrated(true);
        }, 3000)
    }, [isAuthenticated])

    const fetchCardOfTheDay = async () => {
        if (Boolean(!isAuthenticated || cardDay?.img_front)) return;

        await dispatch(astroActions.getCardDay());
    }

    const reFetchCardOfTheDay = async () => {
        if (!cardDay) return;
        if (PREVIOUSLY_LANGUAGE === i18n.language) return;
        PREVIOUSLY_LANGUAGE = i18n.language;
        await dispatch(astroActions.getCardDay());
    }

    useEffect(() => {
        reFetchCardOfTheDay();
    }, [i18n.language])

    useEffect(() => {
        fetchCardOfTheDay();
    }, [cardDay?.img_front, isAuthenticated])

    const handleAuth = () => {
        dispatch(authActions.setIsOpenModal(true));
    }

    if (!isAuthenticated && hydrated) {
        return (
            <Section className="flex gap-[15px] m-0 relative h-[280px] pr-3">
                <div className="w-2/5 blur-sm">
                    <Image
                        src={BackgroundImage}
                        placeholder="blur"
                        priority
                        alt={t("card-of-the-day.title")}
                        width={100}
                        blurDataURL={BackgroundImage.src}
                        height={175}
                        className={`w-full h-full transition`}
                    />
                </div>
                <div className="w-3/5">
                    <div className="flex flex-col gap-3 justify-between h-full">
                        <SectionTitle className="mb-0">{t('common.warning')}</SectionTitle>
                        <p className="text-white text-lg text-bold opacity-30 text-center">{t('card-of-the-day.access')}</p>
                        <Button onClick={handleAuth}>{t('common.auth')}</Button>
                    </div>
                </div>
            </Section>
        )
    }

    if (cardDay)
        return (
            <Section id={'card-of-the-day_auth'} className="h-[280px] m-0">
                <div className="flex gap-[15px] h-full w-full">
                    <div className="w-2/5">
                        {cardDay?.img_front &&
                            <Image
                                src={cardDay?.img_front}
                                placeholder="blur"
                                priority
                                alt={cardDay?.name || t("card-of-the-day.title")}
                                width={100}
                                blurDataURL={BackgroundImage.src}
                                height={175}
                                className={`w-full h-full transition duration-100 object-contain  ${loadImage ? '' : 'blur-sm'}`}
                                onLoad={() => setLoadImage(true)}
                            />
                        }
                    </div>
                    <div className="w-3/5 h-full flex flex-col">
                        <SectionTitle>{t("card-of-the-day.title")}</SectionTitle>
                        <div className="flex flex-col gap-3 flex-1 min-h-0">
                            <p className="text-white text-sm flex-shrink-0">{cardDay?.name}</p>
                            <p className="text-white/70 text-sm flex-shrink-0">{t('card-of-the-day.description')}</p>
                            <div className="flex-1 overflow-y-auto red-thin-scrollbar">
                                <p className="text-white/70 text-sm">{t('card-of-the-day.description-2')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        )

    return (
        <Section id={'card-of-the-day_skeleton'} className="flex gap-[15px] m-0 h-[280px]">
            <div className="w-2/5">
                <div className="w-full h-full bg-gradient-card rounded-md" />
            </div>
            <div className="w-3/5 h-full flex flex-col">
                <div className={`mb-6 self-end h-7 bg-gradient-card rounded-md w-4/5`} />
                <div className="flex flex-col gap-3" style={{ flex: '1 0 auto' }}>
                    <div className="bg-gradient-card rounded-md h-5 w-2/3" style={{ flex: '1 0 auto' }}></div>
                    <div className="bg-gradient-card rounded-md h-5 w-1/3" style={{ flex: '1 0 auto' }}></div>
                    <div className="bg-gradient-card rounded-md h-full"></div>
                </div>
            </div>
        </Section>
    )
}


export default memo(CardOfTheDay);