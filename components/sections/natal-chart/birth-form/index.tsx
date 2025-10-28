"use client"

import { Container } from "@/components/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { LocationInput } from "@/components/ui/location-input";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn, formatDateFromDDMMYYYY, formatDateFromYYYYMMDD } from "@/lib/utils";
import { validateBirthDate } from "@/lib/utils/validation";
import { useAppDispatch, userActions } from "@/store";
import { astroApiService } from "@/lib/services/astro-api";
import { useAppSelector } from "@/store";
import { selectBirthData } from "@/store/selectors/user";
import { useNotify } from "@/providers/notify-provider";
import { Loader } from "@/components/ui/loader";
import { useTimezone } from "@/hooks/useTimezone";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import { TimeInput } from "@/components/ui/input/time-input";

type BirthFormProps = {
    onClose: () => void;
    onSave?: () => void;
    className?: string;
    title?: string;
    background?: boolean;
    isBirthForm?: boolean;
    showOnlyInfo?: boolean;
}

export function BirthForm({ onClose, onSave, className, isBirthForm, title, showOnlyInfo, background = true }: BirthFormProps) {
    const { t } = useTranslation()
    const [isDone, setIsDone] = useState(false)
    const birthData = useAppSelector(selectBirthData)
    const [isLoading, setIsLoading] = useState(false)
    const { notify } = useNotify();
    const { getTimezone } = useTimezone();
    const { getLocationByCoordinates } = useLocationSearch();
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({
        date: isBirthForm ? "" : birthData.date ? formatDateFromYYYYMMDD(birthData.date) : "",
        time: isBirthForm ? "" : birthData.time ? birthData.time : "",
        place: isBirthForm ? "" : birthData.place ? birthData.place : "",
        latitude: isBirthForm ? 0 : birthData.latitude ? birthData.latitude : 0,
        longitude: isBirthForm ? 0 : birthData.longitude ? birthData.longitude : 0,
        timezone: isBirthForm ? "" : birthData.timezone ? birthData.timezone : ""
    })
    const [dateError, setDateError] = useState<string | undefined>()

    useEffect(() => {
        const fetchLocationName = async () => {
            if (birthData.latitude && birthData.longitude && !birthData.place) {
                try {
                    const locationName = await getLocationByCoordinates(birthData.latitude, birthData.longitude);
                    dispatch(userActions.setBirthPlace(locationName));

                    setFormData(prev => ({
                        ...prev,
                        place: locationName
                    }));
                } catch (error) {
                    console.error('Failed to fetch location name:', error);
                }
            }
        };

        fetchLocationName();
    }, [birthData.latitude, birthData.longitude, birthData.place, getLocationByCoordinates, dispatch]);

    useEffect(() => {
        const validation = validateBirthDate(formData.date)
        setDateError(validation.error)

        const isValid = formData.date !== "" &&
            formData.time !== "" &&
            formData.place !== "" &&
            formData.latitude !== 0 &&
            formData.longitude !== 0 &&
            !validation.error

        setIsDone(isValid)
    }, [formData.date, formData.time, formData.place, formData.latitude, formData.longitude])

    const handleChange = (key: string, value: string | number) => {
        const newFormData = { ...formData, [key]: value }
        setFormData(newFormData)

        if (key === 'date') {
            const validation = validateBirthDate(value as string)
            setDateError(validation.error)

            const isValid = newFormData.date !== "" &&
                newFormData.time !== "" &&
                newFormData.place !== "" &&
                newFormData.latitude !== 0 &&
                newFormData.longitude !== 0 &&
                !validation.error
            setIsDone(isValid)
        } else {
            const isValid = newFormData.date !== "" &&
                newFormData.time !== "" &&
                newFormData.place !== "" &&
                newFormData.latitude !== 0 &&
                newFormData.longitude !== 0 &&
                !dateError
            setIsDone(isValid)
        }
    }

    const handleLocationChange = async (place: string, latitude: number, longitude: number) => {
        const newFormData = { ...formData, place, latitude, longitude }
        setFormData(newFormData)

        try {
            const timezone = await getTimezone(latitude, longitude);
            setFormData(prev => ({ ...prev, timezone }));
        } catch (error) {
            console.error('Failed to get timezone:', error);
        }

        const isValid = newFormData.date !== "" &&
            newFormData.time !== "" &&
            place !== "" &&
            latitude !== 0 &&
            longitude !== 0 &&
            !dateError
        setIsDone(isValid)
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
                berth_place: formData.place,
                berth_latitude: formData.latitude,
                berth_longitude: formData.longitude,
                berth_timezone: formData.timezone
            })


            await dispatch(userActions.updateUserClient({
                berth_date: formattedDate,
                berth_time: response.data.berth_time,
                berth_place: formData.place,
                berth_latitude: response.data.berth_latitude,
                berth_longitude: response.data.berth_longitude,
                berth_timezone: response.data.berth_timezone
            }))

            notify('success', t('messages.updated.userData'))

            onSave?.();
            return;
        } catch (error) {
            notify('error', response?.message || t('messages.error.generic'))

        } finally {
            setIsLoading(false)
        }

    }

    const handleClose = () => {
        onClose();
    }

    return (

        <form className={cn(className, { "bg-section-gradient/90 gradient-dark-section relative shadow-section backdrop-blur-md border border-black/20 p-5 rounded-xl": background })} onSubmit={handleSubmit}>
            {isLoading && <Loader />}
            <SectionTitle anchor="left">{title || t('natal-chart.birth-form.title')}</SectionTitle>

            <Container className="flex-col gap-6">
                <DateInput
                    label={t('natal-chart.birth-form.date')}
                    placeholder={"dd/mm/yyyy"}
                    value={formData.date}
                    onChange={(value) => handleChange("date", value)}
                />
                {dateError && formData.date.length > 0 && (
                    <p className="text-red-500 text-sm">{t(dateError)}</p>
                )}
                <TimeInput
                    label={t('natal-chart.birth-form.time')}
                    value={formData.time}
                    onChange={(value) => handleChange('time', value)}
                />
                <LocationInput
                    label={t('natal-chart.birth-form.place')}
                    placeholder={birthData.place || t("natal-chart.birth-form.place-placeholder")}
                    value={formData.place}
                    onChange={handleLocationChange}
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