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
    const dispatch = useAppDispatch();
    const {notify} = useNotify();
    const isCanCreateFateMatrix = useAppSelector(state => state.user.permissions?.fateMatrixStore);
    const isCanGetFateMatrix = useAppSelector(state => state.user.permissions?.fateMatrixInfo);
    const isFateMatrix = useAppSelector(state => state.user.isFateMatrix);

    const handleSubmitBirthForm = () => {
        if (!isCanCreateFateMatrix && !isCanGetFateMatrix) {
            notify('error', "You don't have permission to create a fate matrix");
            dispatch(userActions.setShowSubscription(true));
            setCurrentView("subscription");
            return;
        }

        const fetchNatalChart = async () => {
            await dispatch(astroActions.getFateMatrix(isFateMatrix));
        }
        fetchNatalChart();
        setCurrentView("chart");
    }

    useEffect(() => {
        return () => {
            setCurrentView("introduce");
        }
    }, []);

    
    const renderCurrentView = () => {
        const showBirthForm = () => setCurrentView("birth");
        const showChart = () => setCurrentView("chart");
        const showSubscription = () => setCurrentView("subscription");

        switch (currentView) {
            case "introduce":
                return <Introduce onProceed={showBirthForm} title={t('destiny-matrix.introduce.title')} textOne={t('destiny-matrix.introduce.text-one')} textTwo={t('destiny-matrix.introduce.text-two')} />;
            case "birth":
                return <BirthForm onClose={showChart} onSave={handleSubmitBirthForm} className="w-[90%]" />;
            case "chart":
                return <Chart onSave={showSubscription} />;
            default:
                return <Introduce onProceed={showBirthForm} title={t('destiny-matrix.introduce.title')} textOne={t('destiny-matrix.introduce.text-one')} textTwo={t('destiny-matrix.introduce.text-two')} />;
        }
    };

    return (
        <Main className="flex flex-col justify-center items-center">
            {renderCurrentView()}
        </Main>
    )
}