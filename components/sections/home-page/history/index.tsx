import { Section } from "@/components/layouts/section";

import { useTranslation } from "@/hooks/useTranslation";
import { Container } from "@/components/container";
import { CardHistory } from "./card-history";
import { SectionTitle } from "@/components/ui/section-title";
import { tarotActions, useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";


let REQUEST_SENDED = false;

export function Categories() {
    const { t } = useTranslation()
    const dispatch = useAppDispatch();
    const categories = useAppSelector(state => state.tarot.categories);

    const fetchCategories = async () => {
        if (categories || REQUEST_SENDED) return;
        REQUEST_SENDED = true;
        await dispatch(tarotActions.getTarotCategories({ page: 1, per_page: 7 }));
    }

    useEffect(() => {
        fetchCategories();
    }, []);

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