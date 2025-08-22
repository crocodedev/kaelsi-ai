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
import { validateBirthDate } from "@/lib/utils/validation";
import { useAppDispatch, userActions } from "@/store";
import { astroApiService } from "@/lib/services/astro-api";
import { useAppSelector } from "@/store";
import { selectBirthData } from "@/store/selectors/user";
import { useNotify } from "@/providers/notify-provider";
import { Loader } from "@/components/ui/loader";

interface BirthFormProps {
    onClose: () => void;
    onSave?: () => void;
    className?: string;
    title?: string;
    background?: boolean;
    showOnlyInfo?: boolean
}

export function BirthForm({ onClose, onSave, className, title, showOnlyInfo, background = true }: BirthFormProps) {
    const { t } = useTranslation()
    const [isDone, setIsDone] = useState(false)
    const birthData = useAppSelector(selectBirthData)
    const [isLoading, setIsLoading] = useState(false)
    const { notify } = useNotify();
    const [formData, setFormData] = useState({
        date: showOnlyInfo ? birthData.date : "",
        time: showOnlyInfo ? birthData.time : "",
        place: showOnlyInfo ? birthData.place : ""
    })
    const [dateError, setDateError] = useState<string | undefined>()
    const dispatch = useAppDispatch()

    const handleChange = (key: string, value: string) => {
        const newFormData = { ...formData, [key]: value }
        setFormData(newFormData)

        if (key === 'date') {
            const validation = validateBirthDate(value)
            setDateError(validation.error)

            const isValid = Object.values(newFormData).every(value => value !== "") && !validation.error
            setIsDone(isValid)
        } else {
            const isValid = Object.values(newFormData).every(value => value !== "") && !dateError
            setIsDone(isValid)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, type?: string) => {
        setIsLoading(true)
        e.preventDefault()
        let response;
        try {
            const dateValidation = validateBirthDate(formData.date)
            if (!dateValidation.isValid) {
                setDateError(dateValidation.error)
                return
            }

            const formattedDate = formatDateFromDDMMYYYY(formData.date);

            response = await astroApiService.updateUser({
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
            return;
        } catch (error) {
            notify('error', response?.message || "Something went wrong. Try againt later.")

        } finally {
            setIsLoading(false)
        }

    }

    const handleClose = () => {
        onClose();
    }



    return (

        <form className={cn(className, { "bg-section-gradient/90 gradient-dark-section shadow-section backdrop-blur-md border border-black/20 p-5 rounded-xl": background })} onSubmit={handleSubmit}>
            {isLoading && <Loader />}
            <SectionTitle anchor="left">{title || t('natal-chart.birth-form.title')}</SectionTitle>

            <Container className="flex-col gap-6">
                <DateInput
                    label={t('natal-chart.birth-form.date')}
                    placeholder={"dd/mm/yyyy"}
                    value={showOnlyInfo ? birthData.date : formData.date}
                    onChange={(value) => handleChange("date", value)}
                />
                {dateError && (
                    <p className="text-red-500 text-sm">{dateError}</p>
                )}
                <Input
                    label={t('natal-chart.birth-form.time')}
                    placeholder={"00:00"}
                    value={showOnlyInfo ? birthData.time : formData.time}
                    type="time"
                    validation={'Time'}
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
                        <Button className="w-full" type="submit">{t('natal-chart.birth-form.update')}</Button>
                    </div>
                ) : (
                    <div className="actions flex gap-4">
                        <Button variant="outline" className="w-full" onClick={handleClose}>{t('natal-chart.birth-form.close')}</Button>
                        <Button disabled={!isDone} type="submit" className="w-full">{t('natal-chart.birth-form.save')}</Button>
                    </div>
                )}
            </Container>
        </form>
    )
}