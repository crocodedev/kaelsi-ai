import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { useTranslation } from "@/hooks/useTranslation";

export function CardOfTheDay() {
    const { t } = useTranslation()
    return (
        <Section className="flex gap-[15px]">
            <div className="column">
                <div className="w-[90px] h-full gradient-section" />
            </div>
            <div className="column">
                <SectionTitle title={t('card-of-the-day.title')} />
                <div className="flex flex-col gap-3">
                    <p className="text-white text-sm">{t('card-of-the-day.subtitle')}</p>
                    <p className="text-white/70 text-sm">{t('card-of-the-day.description')}</p>
                    <p className="text-white/70 text-sm">{t('card-of-the-day.description-2')}</p>
                </div>
            </div>
        </Section>
    )
}