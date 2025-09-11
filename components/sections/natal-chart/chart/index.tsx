'use client'

import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { useTranslation } from "@/hooks/useTranslation";
import { ResultField } from "./result-field";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { astroActions, useAppDispatch, useAppSelector, userActions } from "@/store";
import { useEffect } from "react";
import { useNotify } from "@/providers/notify-provider";
import Image from "next/image";
import { ResultContainer } from "@/components/result";

type ChartProps = {
    isNatalChart?: boolean;
    onSave: () => void;
    onPremissionDenied: () => void;
}

const DATA_RESULT_FIELD = [
    { id: '123', category: 'Personal Qualities', answer: "Your Destiny Matrix decodes your soul's journey, helping you upgrade your life style and relationships with precision" },
    { id: '124', category: 'Past Life', answer: "Your past life experiences shape your current life, revealing your soul's growth and lessons from previous incarnations." },
    { id: '125', category: 'Life Script', answer: "Your life script is a blueprint of your soul's journey, guiding you to enhance your lifestyle and relationships with precision." },
    { id: '126', category: 'Talents', answer: "Your talents are the unique gifts you possess, helping you excel in various areas of life and achieve your full potential." },
    { id: '127', category: 'Purpose', answer: "Your purpose is the reason you exist, guiding you to live a life that is meaningful and fulfilling." },
]


const FateMatrix = ({ svgString }: { svgString: string }) => {
    return (
        <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: svgString }}
        />
    )
}

const NatalChart = ({ image }: { image: string }) => {
    if (!image) return null;

    return (
        <Image src={image} width={320} height={386} alt="Natal Chart" className="w-full h-[90%]" />
    )
}


export function Chart({ isNatalChart, onPremissionDenied, onSave }: ChartProps) {
    const { t } = useTranslation()
    const { notify } = useNotify();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    const isHaveSubscription = user?.subscription?.id !== undefined;

    const isUserCanStoreNatalChart = user?.permissions?.natalChartStore;
    const isUserCanGetNatalChart = user?.permissions?.natalChartInfo;
    const isUserCanProccessNatalChart = isUserCanGetNatalChart || isUserCanStoreNatalChart;

    const readingNatal = useAppSelector(state => state.astro.natalChart?.reading)
    const readingMatrix = useAppSelector(state => state.astro.fateMatrix?.reading)

    const reading = readingMatrix || readingNatal;

    const isUserCanStoreFateMatrix = user?.permissions?.fateMatrixStore;
    const isUserCanGetFateMatrix = user?.permissions?.fateMatrixInfo;
    const isUserCanProccessFateMatrix = isUserCanGetFateMatrix || isUserCanStoreFateMatrix;

    const isUserStoredNatalChart = user?.isNatalChart;
    const isUserStoredFateMatrix = user?.isFateMatrix;


    const fateMatrix = useAppSelector(state => state.astro.fateMatrix);
    const natalChart = useAppSelector(state => state.astro.natalChart);



    const svgString = fateMatrix?.svg || '';

    const validatePermissions = () => {
        if (isNatalChart && !isUserCanProccessNatalChart) {
            notify('error', t('messages.permissions.natalChart.storeDenied'));
            dispatch(userActions.setShowSubscription(true));
            return false;
        }

        if (!isNatalChart && !isUserCanProccessFateMatrix) {
            notify('error', t('messages.permissions.fateMatrix.storeDenied'));
            dispatch(userActions.setShowSubscription(true));
            return false;
        }

        return true;
    }


    useEffect(() => {
        console.log(isNatalChart)
        console.log('render')
        if (!validatePermissions()) {
            onPremissionDenied();
            return;
        };

        const fetchNatalChart = async () => {
            if (natalChart) return;
            await dispatch(astroActions.getNatalChart(isUserStoredNatalChart || false));
        }
        const fetchFateMatrix = async () => {
            if (fateMatrix) return;
            await dispatch(astroActions.getFateMatrix(isUserStoredFateMatrix || false));
        }

        if (isNatalChart) {
            fetchNatalChart();
        } else {
            fetchFateMatrix();
        }
    }, [isNatalChart])

    const handleSave = () => {
        if (!isHaveSubscription) {
            dispatch(userActions.setShowSubscription(true));
            return;
        }
        onSave();
    }


    const renderChart = () => {
        if (isNatalChart) {
            return <NatalChart image={natalChart?.image || ''} />
        }
        return <FateMatrix svgString={svgString} />
    }


    return (
        <Section className="justify-center items-center w-[90%] mx-5 overflow-y-auto max-h-[70vh] hide-scrollbar">
            <SectionTitle>{t('natal-chart.chart.title')}</SectionTitle>
            <div className="flex justify-center items-center mb-6 rounded-xl h-96">
                {renderChart()}
            </div>
            <Container className="flex-col gap-4">
                {reading?.map(item => (
                    <ResultField category={item.category} answer={item.text} />
                ))}
                {!reading &&
                    <div className="w-full mt-1 flex justify-center items-center rounded-lg shadow-lg h-40 overflow-y-auto hide-scrollbar">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                }
            </Container>
        </Section >
    )
}