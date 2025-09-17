import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { useTranslation } from "@/hooks/useTranslation";
import { astroActions, authActions, useAppDispatch, useAppSelector } from "@/store";
import Image from "next/image";
import BackgroundImage from "@/assets/cards/background-card.jpg"
import { memo, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

let FIRST_RENDER = true;

function CardOfTheDay() {
    const { t } = useTranslation()
    const { isAuthenticated } = useAuth();
    const dispatch = useAppDispatch();
    const cardDay = useAppSelector(state => state.astro.cardDay);
    const isLoading = useAppSelector(state => state.astro.loading);



    const fetchCardOfTheDay = async () => {
        if (Boolean(!isAuthenticated || cardDay?.img_front)) return;

        await dispatch(astroActions.getCardDay());
        FIRST_RENDER = false;
    }

    useEffect(() => {
        fetchCardOfTheDay();
    }, [cardDay?.img_front, isAuthenticated])


    const handleAuth = () => {
        dispatch(authActions.setIsOpenModal(true));
    }

    if ((FIRST_RENDER && !cardDay?.img_front) || isLoading) {
        return (
            <Section className="w-full m-0 h-[280px]  bg-white/10 animate-pulse" />
        )
    }


    if (!isAuthenticated) {
        return (
            <Section className="flex gap-[15px] m-0 relative h-[280px]">
                <div className="w-2/5 blur-sm">
                    <Image
                        src={BackgroundImage}
                        placeholder="blur"
                        priority
                        alt={t("card-of-the-day.title")}
                        width={100}
                        blurDataURL={BackgroundImage.src}
                        height={175}
                        className="w-full h-full"
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



    return (
        <Section className="flex gap-[15px] m-0 h-[280px]">
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
                        className="w-full h-full"
                    />
                }
            </div>
            <div className="w-3/5">
                <SectionTitle >{cardDay?.name || t("card-of-the-day.title")}</SectionTitle>
                <div className="flex flex-col gap-3">
                    <p className="text-white text-sm">{t('card-of-the-day.subtitle')}</p>
                    <p className="text-white/70 text-sm">{t('card-of-the-day.description')}</p>
                    <p className="text-white/70 text-sm">{t('card-of-the-day.description-2')}</p>
                </div>
            </div>
        </Section>
    )
}


export default memo(CardOfTheDay);