import { Section } from "@/components/layouts/section";

import { useTranslation } from "@/hooks/useTranslation";
import { Container } from "@/components/container";
import { CardHistory } from "./card-history";
import { SectionTitle } from "@/components/ui/section-title";

const DATA_HISTORY = [
    { id: 7, text: 'history.categories.education' },
    { id: 5, text: 'history.categories.friends' },
    { id: 2, text: 'history.categories.family' },
    { id: 3, text: 'history.categories.travel' },
    { id: 4, text: 'history.categories.health' },
    { id: 1, text: 'history.categories.love' },
    { id: 6, text: 'history.categories.work' },
]


export function History() {
    const { t } = useTranslation()

    return (
        <Section>
            <SectionTitle >{t('history.title')}</SectionTitle>
            <Container>
                {DATA_HISTORY.map((item) => {
                    const { id, text } = item
                    return (
                        <CardHistory key={id} text={text} />
                    )
                })}
            </Container>
        </Section>
    )
}