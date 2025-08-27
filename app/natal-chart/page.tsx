"use client";

import { Introduce } from "@/components/sections/natal-chart/introduce";
import { Main } from "@/components/main";
import { BirthForm } from "@/components/sections/natal-chart/birth-form";
import { Chart } from "@/components/sections/natal-chart/chart";
import { Subscription } from "@/components/subcription";
import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { astroActions, useAppDispatch, useAppSelector, userActions } from "@/store";
import { selectHasBirthData } from "@/store/selectors/user";
import { useNotify } from "@/providers/notify-provider";

type CurrentView = "introduce" | "birth" | "chart" | "subscription";

export default function NatalChart() {
    const [currentView, setCurrentView] = useState<CurrentView>("introduce");
    const { t } = useTranslation();
    const {notify} = useNotify();
    const dispatch = useAppDispatch();
    const isCanGetNatalChart = useAppSelector(state => state.user.permissions?.natalChartInfo);
    const isCanCreateNatalChart = useAppSelector(state => state.user.permissions?.natalChartStore);
    const isNatalChart = useAppSelector(state => state.user.isNatalChart);

    const hasBirthData = useAppSelector(selectHasBirthData);
    
    useEffect(() => {
        if (hasBirthData) {
            setCurrentView("chart");
        }
    }, [hasBirthData]);
    
    const showBirthForm = () => setCurrentView("birth");
    const showIntroduce = () => setCurrentView("introduce");

    const handleSubmitBirthForm = () => {
        if (!isCanGetNatalChart && !isCanCreateNatalChart) {
            notify('error', "You don't have permission to create a natal chart");
            dispatch(userActions.setShowSubscription(true));
            setCurrentView("subscription");
            return;
        }
        const fetchNatalChart = async () => {
            await dispatch(astroActions.getNatalChart(isNatalChart));
        }
        fetchNatalChart();
        setCurrentView("chart");
    }

    useEffect(() => {
        return () => {
            setCurrentView("introduce");
        }
    }, []);


    const handleSaveNatalChart=()=>{
        notify('success', "Natal chart saved");
    }

    const renderCurrentView = () => {
        switch (currentView) {
            case "introduce":
                return <Introduce onProceed={showBirthForm} title={t('natal-chart.introduce.title')} textOne={t('natal-chart.introduce.text-one')} textTwo={t('natal-chart.introduce.text-two')} />;
            case "birth":
                return <BirthForm onClose={showIntroduce} onSave={handleSubmitBirthForm} className="w-[90%]" />;
            case "chart":
                return <Chart isNatalChart={true} onSave={handleSaveNatalChart} />;
            case "subscription":
                return <Subscription />;
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
