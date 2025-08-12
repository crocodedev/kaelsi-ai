'use client'

import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { useTranslation } from "@/hooks/useTranslation";
import { ResultField } from "./result-field";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector, userActions } from "@/store";

interface ChartProps {
    onSave: () => void;
}

const DATA_RESULT_FIELD = [
    { id: '123', category: 'Personal Qualities', answer: "Your Destiny Matrix decodes your soul's journey, helping you upgrade your life style and relationships with precision" },
    { id: '124', category: 'Past Life', answer: "Your past life experiences shape your current life, revealing your soul's growth and lessons from previous incarnations." },
    { id: '125', category: 'Life Script', answer: "Your life script is a blueprint of your soul's journey, guiding you to enhance your lifestyle and relationships with precision." },
    { id: '126', category: 'Talents', answer: "Your talents are the unique gifts you possess, helping you excel in various areas of life and achieve your full potential." },
    { id: '127', category: 'Purpose', answer: "Your purpose is the reason you exist, guiding you to live a life that is meaningful and fulfilling." },
]


export function Chart({ onSave }: ChartProps) {
    const { t } = useTranslation()
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    const isHaveSubscription = user?.subscription.id !== undefined;

    const handleSave = () => {
        if (!isHaveSubscription) {
            dispatch(userActions.setShowSubscription(true));
            return;
        }
        onSave();
    }

    return (
        <Section className="justify-center items-center w-[90%] mx-5 overflow-y-auto h-[70vh] hide-scrollbar">
            <SectionTitle>{t('natal-chart.chart.title')}</SectionTitle>
            <div className="flex justify-center items-center  h-[320px] bg-black mb-6 rounded-xl">Natal Chart</div>
            <Container className="flex-col gap-4">
                {DATA_RESULT_FIELD.map((item) => {
                    const { id, category, answer } = item
                    return (
                        <ResultField key={id} category={category} answer={answer} />
                    )
                })}
                <Button onClick={handleSave}>Save</Button>
            </Container>
        </Section>
    )
}