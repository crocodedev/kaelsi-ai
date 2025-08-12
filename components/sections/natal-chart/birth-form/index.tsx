"use client"

import { Container } from "@/components/container";
import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn, formatDateFromDDMMYYYY } from "@/lib/utils";
import { useAppDispatch, userActions } from "@/store";
import { astroApiService } from "@/lib/services/astro-api";
import { useAppSelector } from "@/store";
import { selectBirthData } from "@/store/selectors/user";

interface BirthFormProps {
    onClose: () => void;
    onSave?: () => void;
    className?: string;
    title?: string;
    showOnlyInfo?: boolean
}

export function BirthForm({ onClose, onSave, className, title, showOnlyInfo }: BirthFormProps) {
    const { t } = useTranslation()
    const [isDone, setIsDone] = useState(false)
    const birthData = useAppSelector(selectBirthData)
    const [formData, setFormData] = useState({
        date: showOnlyInfo ? birthData.date : "",
        time: showOnlyInfo ? birthData.time : "",
        place: showOnlyInfo ? birthData.place : ""
    })
    const dispatch = useAppDispatch()

    const handleChange = (key: string, value: string) => {
        const newFormData = { ...formData, [key]: value }
        setFormData(newFormData)
        setIsDone(Object.values(newFormData).every(value => value !== ""))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formattedDate = formatDateFromDDMMYYYY(formData.date);

        astroApiService.updateUser({
            berth_date: formattedDate,
            berth_time: formData.time,
            berth_place: formData.place
        })

        dispatch(userActions.updateUser({
            berth_date: formattedDate,
            berth_time: formData.time,
            berth_place: formData.place
        }))

        onSave?.();
    }

    const handleClose = () => {
        onClose();
    }

    const handleUpdate = () => {
        const formattedDate = formatDateFromDDMMYYYY(formData.date);

        astroApiService.updateUser({
            berth_date: formattedDate,
            berth_time: formData.time,
            berth_place: formData.place
        })

        dispatch(userActions.updateUser({
            berth_date: formattedDate,
            berth_time: formData.time,
            berth_place: formData.place
        }))
    }

    return (
        <form className={cn("mb-20 w-[90%] mx-5", className)} onSubmit={handleSubmit}>
            <SectionTitle >{title || t('natal-chart.birth-form.title')}</SectionTitle>

            <Container className="flex-col gap-6">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <DateInput
                        label={t('natal-chart.birth-form.date')}
                        placeholder={"dd/mm/yyyy"}
                        value={showOnlyInfo ? birthData.date : formData.date}
                        onChange={(value) => handleChange("date", value)}
                    />
                    <Input
                        label={t('natal-chart.birth-form.time')}
                        placeholder={"00:00"}
                        value={showOnlyInfo ? birthData.time : formData.time}
                        type="time"
                        onChange={e => handleChange("time", e.target.value)}
                    />
                    <Input
                        label={t('natal-chart.birth-form.place')}
                        placeholder={birthData.place || t("natal-chart.birth-form.place-placeholder")}
                        value={showOnlyInfo ? birthData.place : formData.place}
                        onChange={e => handleChange("place", e.target.value)}
                    />
                    {showOnlyInfo ? (
                        <div className="actions flex gap-4">
                            <Button  className="w-full" onClick={handleUpdate}>{t('natal-chart.birth-form.update')}</Button>
                        </div>
                    ) : (
                        <div className="actions flex gap-4">
                            <Button variant="outline" className="w-full" onClick={handleClose}>{t('natal-chart.birth-form.close')}</Button>
                            <Button disabled={!isDone} type="submit" className="w-full">{t('natal-chart.birth-form.save')}</Button>
                        </div>
                    )}
                </form>
            </Container>
        </form>
    )
}