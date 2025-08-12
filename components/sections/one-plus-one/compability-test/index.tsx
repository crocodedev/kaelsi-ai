"use client"

import { Section } from "@/components/layouts/section";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";
import { BirthForm } from "@/components/sections/natal-chart/birth-form";
import { useState } from "react";

type Tab = "natal-chart" | "matrix-of-destiny"

export function CompabilityTest() {

    const [activeTab, setActiveTab] = useState<Tab>("natal-chart")

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
                <h2>Compability Test</h2>
            </SectionTitle>
            <div className="flex flex-col just-start gap-4 mb-6">
                <h3 className="text-white text-sm">Choose a reading method:</h3>
                <div className="flex justify-between items-center gap-4">
                    <Button onClick={handleTabChange.bind(null, "natal-chart")} variant={activeTab === "natal-chart" ? "primary" : "outline"} className="text-nowrap flex-1">Natal Chart</Button>
                    <Button onClick={handleTabChange.bind(null, "matrix-of-destiny")} variant={activeTab === "matrix-of-destiny" ? "primary" : "outline"} className="text-nowrap !px-4 flex-1">Matrix of destiny</Button>
                </div>
            </div>
            <BirthForm className="w-full m-0 mb-6" onClose={handleClose} onSave={handleSave} title="Partner Birth Information" />

        </Section>
    )
}