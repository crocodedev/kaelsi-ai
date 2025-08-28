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
import { Subscription } from "@/components/subcription";

type CurrentView = "introduce" | "birth" | "chart" | "subscription";

export default function DestinyMatrix() {
    const [currentView, setCurrentView] = useState<CurrentView>("introduce");
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { notify } = useNotify();

    const hasBirthData = useAppSelector(selectHasBirthData);
    const isCanCreateFateMatrix = useAppSelector(state => state.user.isFateMatrix);
    const isFateMatrix = useAppSelector(state => state.user.isFateMatrix);

    useEffect(() => {
        if (hasBirthData && isCanCreateFateMatrix) {
            setCurrentView("chart");
        }
    }, [hasBirthData, isCanCreateFateMatrix]);

    const handleSubmitBirthForm = () => {
        if (!isCanCreateFateMatrix) {
            notify('error', "You don't have permission to create a fate matrix");
            dispatch(userActions.setShowSubscription(true));
            return;
        }

        const fetchFateMatrix = async () => {
            await dispatch(astroActions.getFateMatrix(isFateMatrix));
        }

        fetchFateMatrix();
        setCurrentView("chart");
    }

    
    useEffect(() => {
        return () => {
            setCurrentView("introduce");
        }
    }, []);

    const handleSaveFateMatrix = () => {
        notify('success', "Natal chart saved");
    }


    const renderCurrentView = () => {
        const showBirthForm = () => setCurrentView("birth");
        const handleShowIntroduce = () => setCurrentView("introduce")

        switch (currentView) {
            case "introduce":
                return <Introduce onProceed={showBirthForm} title={t('destiny-matrix.introduce.title')} textOne={t('destiny-matrix.introduce.text-one')} textTwo={t('destiny-matrix.introduce.text-two')} />;
            case "birth":
                return <BirthForm onClose={handleShowIntroduce} onSave={handleSubmitBirthForm} className="w-[90%]" />;
            case "chart":
                return <Chart onPremissionDenied={handleShowIntroduce} onSave={handleSaveFateMatrix} />;
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