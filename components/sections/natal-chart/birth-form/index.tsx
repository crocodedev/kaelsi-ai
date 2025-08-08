"use client"

import { Container } from "@/components/container";
import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function BirthForm() {
    const { t } = useTranslation()
    const [isDone, setIsDone] = useState(false)
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        place: ""
    })

    const handleChange = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value })
        setIsDone(Object.values(formData).every(value => value !== ""))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('Submit')
    }

    return (
        <Section className="mb-20 w-[90%] mx-5">
            <SectionTitle title={t('natal-chart.birth-form.title')} />

            <Container className="flex-col gap-6">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <DateInput
                        label={t('natal-chart.birth-form.date')}
                        placeholder="dd/mm/yyyy"
                        onChange={(value) => handleChange("date", value)}
                    />
                    <Input
                        label={t('natal-chart.birth-form.time')}
                        placeholder="00:00:00"
                        type="time"
                        onChange={e => handleChange("time", e.target.value)}
                    />
                    <Input
                        label={t('natal-chart.birth-form.place')}
                        placeholder={t("natal-chart.birth-form.place-placeholder")}
                        onChange={e => handleChange("place", e.target.value)}
                    />
                    <div className="actions flex gap-4">
                        <Button variant="outline" className="w-full">{t('natal-chart.birth-form.close')}</Button>
                        <Button disabled={!isDone} type="submit" className="w-full">{t('natal-chart.birth-form.save')}</Button>
                    </div>
                </form>
            </Container>
        </Section>
    )
}