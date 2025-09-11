import { Section } from "@/components/layouts/section";

import { useTranslation } from "@/hooks/useTranslation";
import { Container } from "@/components/container";
import { CardHistory } from "./card-history";
import { SectionTitle } from "@/components/ui/section-title";
import { useAppSelector } from "@/store";


export function Categories() {
    const { t } = useTranslation()
    const categories = useAppSelector(state => state.tarot.categories);

    return (
        <Section className="m-0">
            <SectionTitle >{t('history.title')}</SectionTitle>
            <Container>
                {categories?.slice(0, 7)?.map((item) => {
                    if (!item.name) return
                    return (
                        <CardHistory key={item.id} category={item} />
                    )
                })}
            </Container>
        </Section>
    )
}