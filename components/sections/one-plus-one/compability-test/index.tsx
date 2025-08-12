"use client"

import { Section } from "@/components/layouts/section";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";
import { BirthForm } from "@/components/sections/natal-chart/birth-form";

export function CompabilityTest() {
    return (
        <Section className="max-h-[70vh] overflow-y-auto hide-scrollbar">
            <SectionTitle>
                <h2>Compability Test</h2>
            </SectionTitle>
            <div className="flex flex-col just-start gap-4 mb-6">
                <h3 className="text-white text-sm">Choose a reading method:</h3>
                <div className="flex justify-between items-center gap-4">
                    <Button className="text-nowrap flex-1">Natal Chart</Button>
                    <Button variant="outline" className="text-nowrap !px-4 flex-1">Matrix of destiny</Button>
                </div>
            </div>
            <BirthForm className="w-full m-0 mb-6" onClose={() => { }} onSave={() => { }} title="Partner Birth Information" />
            <div className="flex justify-between items-center gap-4">
                <Button>Save</Button>
                <Button variant="outline">Close</Button>
            </div>
        </Section>
    )
}