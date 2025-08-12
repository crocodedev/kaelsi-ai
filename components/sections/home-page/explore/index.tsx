import { Section } from "@/components/layouts/section";
import { Icon, ICONS } from "@/components/ui/icon/Icon";
import { useTranslation } from "@/hooks/useTranslation";
import { Container } from "@/components/container";
import { CardExplore } from "./card-explore";
import { SectionTitle } from "@/components/ui/section-title";


const DATA_CARDS = [
    { id: '1', title: 'navigation.tarot', icon: 'tarot', link: '/tarot' },
    { id: '2', title: 'navigation.compat', icon: 'compat', link: '/one-plus-one' },
    { id: '3', title: 'navigation.natalChart', icon: 'natalChart', link: '/natal-chart' },
    { id: '4', title: 'navigation.destinyMatrix', icon: 'destinyMatrix', link: '/destiny-matrix' },

] as { id: string, title: string, icon: keyof typeof ICONS, link: string }[]

export function Explore() {
    const { t } = useTranslation()
    return (
        <Section className="m-0">
            <SectionTitle >{t('explore.title')}</SectionTitle>

            <Container>
                {DATA_CARDS.map((card) => {
                    const { id, title, icon, link } = card
                    return (
                        <CardExplore key={id} title={title} icon={icon} link={link} />
                    )
                })}
            </Container>
        </Section>
    )
}