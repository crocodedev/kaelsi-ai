'use client'

import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { useTranslation } from "@/hooks/useTranslation";
import { ResultField } from "./result-field";
import { Container } from "@/components/container";
import { astroActions, useAppDispatch, useAppSelector, userActions } from "@/store";
import { useEffect } from "react";
import { useNotify } from "@/providers/notify-provider";
import Image from "next/image";
import i18n from "@/lib/i18n";

type ChartProps = {
    isNatalChart?: boolean;
    onSave: () => void;
    onPremissionDenied: () => void;
}

const Pentagram = ({ src, alt }: { src?: string, alt: string }) => {
    if (!src) return null;

    return (
      <div className="flex justify-center items-center mb-6 rounded-xl">
        <Image src={src} width={300} height={300} alt={alt} className="w-full h-full max-w-[95%]"/>
      </div>
    )
}

const Loader = ({isLoading, text, errorText}: {isLoading?: boolean, text: string, errorText: string}) => {
  return (
    <div className="w-full mt-1 flex flex-col grow gap-3 justify-center items-center rounded-lg shadow-lg h-40 overflow-y-auto hide-scrollbar">
      <span className="text-white text-sm text-center max-w-3xs">{isLoading ? text : errorText}</span>
      {isLoading && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"/>}
    </div>
  )
}

export function Chart({ isNatalChart, onPremissionDenied, onSave }: ChartProps) {
    const lang = i18n.language
    const { t } = useTranslation()
    const { notify } = useNotify();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);

    const isUserCanStoreNatalChart = user?.permissions?.natalChartStore;
    const isUserCanGetNatalChart = user?.permissions?.natalChartInfo;
    const isUserCanProccessNatalChart = isUserCanGetNatalChart || isUserCanStoreNatalChart;

    const fateMatrix = useAppSelector(state => state.astro.fateMatrix);
    const natalChart = useAppSelector(state => state.astro.natalChart);

    let reading = isNatalChart ? natalChart?.reading : fateMatrix?.reading;

    const isUserCanStoreFateMatrix = user?.permissions?.fateMatrixStore;
    const isUserCanGetFateMatrix = user?.permissions?.fateMatrixInfo;
    const isUserCanProccessFateMatrix = isUserCanGetFateMatrix || isUserCanStoreFateMatrix;

    const isUserStoredNatalChart = user?.isNatalChart;
    const isUserStoredFateMatrix = user?.isFateMatrix;

    const validatePermissions = () => {
        if (isNatalChart && !isUserCanProccessNatalChart) {
            notify('error', t('messages.permissions.natalChart.storeDenied'));
            dispatch(userActions.setShowSubscription(true));
            return false;
        } else if (!isNatalChart && !isUserCanProccessFateMatrix) {
            notify('error', t('messages.permissions.fateMatrix.storeDenied'));
            dispatch(userActions.setShowSubscription(true));
            return false;
        }

        return true;
    }

    useEffect(() => {
        if (!validatePermissions()) {
            onPremissionDenied();
            return;
        }

        const currentData = isNatalChart ? natalChart : fateMatrix;
        const shouldFetch = !currentData || currentData?.language !== lang;

        if (!shouldFetch) return;

        const fetchData = async () => {
            isNatalChart 
            ? await dispatch(astroActions.getNatalChart(isUserStoredNatalChart || false))
            : await dispatch(astroActions.getFateMatrix(isUserStoredFateMatrix || false))
        }

        fetchData();
    }, [isNatalChart, lang, natalChart, fateMatrix, isUserStoredNatalChart, isUserStoredFateMatrix]);

    return (
        <Section className="grow flex flex-col w-[90%] mx-5 max-h-[70vh]">
            <SectionTitle>{t('natal-chart.chart.title')}</SectionTitle>
            <div className="flex flex-col grow overflow-y-auto hide-scrollbar">
              <Pentagram src={isNatalChart ? natalChart?.image : fateMatrix?.image} alt={isNatalChart ? 'Natal Chart' : 'Fate Matrix'}/>
              {reading 
              ? (<Container className="flex-col gap-4">
                  {reading?.map((item, i) => <ResultField category={item.category} answer={item.text} key={i}/>)}
                </Container>) 
              : (<Loader 
                  isLoading={isNatalChart ? isUserCanProccessNatalChart : isUserCanProccessFateMatrix} 
                  text={t('natal-chart.loading.text')}
                  errorText={t('natal-chart.loading.error')}
                />)}
            </div>
        </Section >
    )
}