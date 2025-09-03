"use client";

import { Introduce } from "@/components/sections/natal-chart/introduce";
import { Main } from "@/components/main";
import { BirthForm } from "@/components/sections/natal-chart/birth-form";
import { Chart } from "@/components/sections/natal-chart/chart";

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { astroActions, useAppDispatch, useAppSelector, userActions } from "@/store";
import { selectHasBirthData } from "@/store/selectors/user";
import { useNotify } from "@/providers/notify-provider";

type CurrentView = "introduce" | "birth" | "chart" | "subscription";

export default function NatalChart() {
    const [currentView, setCurrentView] = useState<CurrentView>("introduce");
    const { t } = useTranslation();
    const { notify } = useNotify();
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);
    const isUserCanStoreNatalChart = user?.permissions?.natalChartStore;
    const isUserCanGetNatalChart = user?.permissions?.natalChartInfo;
    const isCanGetNatalChart = isUserCanGetNatalChart || isUserCanStoreNatalChart;
    const natalChart = useAppSelector(state => state.astro.natalChart);

    const isNatalChart = useAppSelector(state => state.user.isNatalChart);
    const hasBirthData = useAppSelector(selectHasBirthData);


    useEffect(() => {
        if (isCanGetNatalChart && hasBirthData) {
            setCurrentView("chart");
        }

        if (hasBirthData && !isCanGetNatalChart) {
            dispatch(userActions.setShowSubscription(true));
            setCurrentView("introduce")
        }
    }, [hasBirthData, isCanGetNatalChart, currentView]);



    const handleSubmitBirthForm = () => {
        if (!isCanGetNatalChart) {
            notify('error', t('messages.permissions.natalChart.createDenied'));
            dispatch(userActions.setShowSubscription(true));
            return;
        }

        const fetchNatalChart = async () => {
            if (natalChart) return;
            await dispatch(astroActions.getNatalChart(isNatalChart));
            dispatch(userActions.setIsNatalChart(true))
        }

        fetchNatalChart();
        setCurrentView("chart");
    }

    const handleSaveNatalChart = () => {
        notify('success', t('messages.saved.natalChart'));
    }

    const renderCurrentView = () => {
        const handleShowIntroduce = () => setCurrentView("introduce")
        const showBirthForm = () => setCurrentView("birth");

        switch (currentView) {
            case "introduce":
                return <Introduce onProceed={showBirthForm} title={t('natal-chart.introduce.title')} textOne={t('natal-chart.introduce.text-one')} textTwo={t('natal-chart.introduce.text-two')} />;
            case "birth":
                return <BirthForm onClose={handleShowIntroduce} onSave={handleSubmitBirthForm} className="w-[90%]" />;
            case "chart":
                return <Chart isNatalChart={true} onPremissionDenied={handleShowIntroduce} onSave={handleSaveNatalChart} />;
            default:
                return <Introduce onProceed={showBirthForm} title={t('natal-chart.introduce.title')} textOne={t('natal-chart.introduce.text-one')} textTwo={t('natal-chart.introduce.text-two')} />;
        }
    };

    return (
        <Main className="flex flex-col justify-center items-center">
            {renderCurrentView()}
        </Main>
    )
}
