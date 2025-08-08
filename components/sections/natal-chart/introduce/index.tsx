"use client"

import { Container } from "@/components/container";
import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";

interface IntroduceProps {
    onProceed: () => void;
}

export function Introduce({ onProceed }: IntroduceProps) {
    const { t } = useTranslation()

    const handleProceed = () => {
        onProceed();
    }

    return (
        <Section className="mb-20">
            <SectionTitle title={t('natal-chart.introduce.title')} className="mb-6" />
            <Container className="gap-4 flex-col">
                <h3 className="text-white text-sm">
                    {t('natal-chart.introduce.text-one')}
                </h3>
                <p className="text-white/70 text-sm">
                    {t('natal-chart.introduce.text-two')}
                </p>
                <Button onClick={handleProceed}>Proceed</Button>
            </Container>
        </Section>
    )
}