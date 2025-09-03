import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppSelector } from "@/store";
import Image from "next/image";
import BackgroundImage from "@/assets/cards/background-card.jpg"
import { memo, useEffect, useState } from "react";


function CardOfTheDay() {
    const { t } = useTranslation()
    const cardDay = useAppSelector(state => state.astro.cardDay);
    const [image, setImage] = useState(cardDay?.img_front || BackgroundImage.src);


    useEffect(() => {
        if (!cardDay?.img_front) return;
        setImage(cardDay?.img_front)
    }, [cardDay?.img_front])


    return (
        <Section className="flex gap-[15px] m-0">
            <div className="w-2/5">
                <Image
                    src={image}
                    placeholder="blur"
                    priority
                    alt={cardDay?.name || t("card-of-the-day.title")}
                    width={100}
                    blurDataURL={BackgroundImage.src}
                    height={175}
                    className="w-full h-full"
                />
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