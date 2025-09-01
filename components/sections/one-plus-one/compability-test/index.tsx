"use client"

import { Section } from "@/components/layouts/section";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";
import { BirthForm } from "@/components/sections/natal-chart/birth-form";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

type Tab = "natal-chart" | "matrix-of-destiny"

export function CompabilityTest() {

    const [activeTab, setActiveTab] = useState<Tab>("natal-chart")
    const { t } = useTranslation();

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab)
    }

    const handleSave = () => {
        console.log("save")
    }

    const handleClose = () => {
        console.log("close")
    }

    return (
        <Section className="max-h-[70vh] overflow-y-auto hide-scrollbar">
            <SectionTitle>
                <h2>{t('one-plus-one.title')}</h2>
            </SectionTitle>
            <div className="flex flex-col just-start gap-4 mb-6">
                <h3 className="text-white text-sm">{t('one-plus-one.chooseMethod')}</h3>
                <div className="flex justify-between items-center gap-4">
                    <Button onClick={handleTabChange.bind(null, "natal-chart")} variant={activeTab === "natal-chart" ? "primary" : "outline"} className="text-nowrap flex-1">{t('one-plus-one.tabs.natal')}</Button>
                    <Button onClick={handleTabChange.bind(null, "matrix-of-destiny")} variant={activeTab === "matrix-of-destiny" ? "primary" : "outline"} className="text-nowrap !px-4 flex-1">{t('one-plus-one.tabs.destiny')}</Button>
                </div>
            </div>
            <BirthForm background={false} isBirthForm={true} className="w-full m-0 mb-6" onClose={handleClose} onSave={handleSave} title={t('one-plus-one.partnerBirthInfo') || 'Partner Birth Information'} />

        </Section>
    )
}