"use client";

import { Introduce } from "@/components/sections/natal-chart/introduce";
import { Main } from "@/components/main";
import { BirthForm } from "@/components/sections/natal-chart/birth-form";
import { Chart } from "@/components/sections/natal-chart/chart";
import { Subscription } from "@/components/subcription";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

type CurrentView = "introduce" | "birth" | "chart" | "subscription";

export default function NatalChart() {
    const [currentView, setCurrentView] = useState<CurrentView>("introduce");
    const { t } = useTranslation();
    const showBirthForm = () => setCurrentView("birth");
    const showChart = () => setCurrentView("chart");
    const showSubscription = () => setCurrentView("subscription");
    const showIntroduce = () => setCurrentView("introduce");

    const renderCurrentView = () => {
        switch (currentView) {
            case "introduce":
                return <Introduce onProceed={showBirthForm} title={t('destiny-matrix.introduce.title')} textOne={t('destiny-matrix.introduce.text-one')} textTwo={t('destiny-matrix.introduce.text-two')} />;
            case "birth":
                return <BirthForm onClose={showIntroduce} onSave={showChart} />;
            case "chart":
                return <Chart onSave={showSubscription} />;
            case "subscription":
                return <Subscription />;
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