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
import { useAuth } from "@/hooks/useAuth";
import { NeedAuth } from "@/components/sections/need-auth";

type CurrentView = "introduce" | "birth" | "chart" | "subscription" | "auth";

export default function DestinyMatrix() {
    const [currentView, setCurrentView] = useState<CurrentView>("introduce");
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { notify } = useNotify();
    const { isAuthenticated } = useAuth();


    const hasBirthData = useAppSelector(selectHasBirthData);
    const user = useAppSelector(state => state.user);
    const isUserCanStoreFateMatrix = user?.permissions?.fateMatrixStore;
    const isUserCanGetFateMatrix = user?.permissions?.fateMatrixInfo;
    const isFateMatrix = useAppSelector(state => state.user.isFateMatrix);
    const isCanGetFateMatrix = isUserCanGetFateMatrix || isUserCanStoreFateMatrix;

    const fateMatrix = useAppSelector(state => state.astro.fateMatrix);

    useEffect(() => {
        if (hasBirthData && isCanGetFateMatrix) {
            setCurrentView("chart");
        }

        if (hasBirthData && !isCanGetFateMatrix) {
            dispatch(userActions.setShowSubscription(true));
            setCurrentView("introduce")
        }
    }, [hasBirthData, isCanGetFateMatrix, currentView]);

    const handleSubmitBirthForm = () => {
        if (!isCanGetFateMatrix) {
            notify('error', t('messages.permissions.fateMatrix.createDenied'));
            dispatch(userActions.setShowSubscription(true));
            return;
        }

        const fetchFateMatrix = async () => {
            if (fateMatrix) return;
            await dispatch(astroActions.getFateMatrix(isFateMatrix));
            dispatch(userActions.setIsFateMatrix(true))
        }

        fetchFateMatrix();
        setCurrentView("chart");
    }

    const handleSaveFateMatrix = () => {
        notify('success', t('messages.saved.fateMatrix'));
    }

    const handleShowBirthForm = () => {
        if (!isAuthenticated) {
            setCurrentView('auth');
            return
        }
        setCurrentView("birth");

    }


    const renderCurrentView = () => {
        const handleShowIntroduce = () => setCurrentView("introduce")

        switch (currentView) {
            case "introduce":
                return <Introduce onProceed={handleShowBirthForm} title={t('destiny-matrix.introduce.title')} textOne={t('destiny-matrix.introduce.text-one')} textTwo={t('destiny-matrix.introduce.text-two')} />;
            case "birth":
                return <BirthForm onClose={handleShowIntroduce} onSave={handleSubmitBirthForm} className="w-[90%]" />;
            case "chart":
                return <Chart onPremissionDenied={handleShowIntroduce} onSave={handleSaveFateMatrix} />;
            case "auth":
                return <NeedAuth title={t('common.warning')} className="w-[90%]" />
            default:
                return <Introduce onProceed={handleShowBirthForm} title={t('destiny-matrix.introduce.title')} textOne={t('destiny-matrix.introduce.text-one')} textTwo={t('destiny-matrix.introduce.text-two')} />;
        }
    };

    return (
        <Main className="flex flex-col justify-center items-center">
            {renderCurrentView()}
        </Main>
    )
}