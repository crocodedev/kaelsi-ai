import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { Select } from "@/components/ui/select";
import { OptionToggler } from "@/components/ui/toggle/option-toggler";
import { useTranslation } from "@/hooks/useTranslation";
import { astroActions, authActions, useAppDispatch, useAppSelector, userActions } from "@/store";
import { UserPreferences } from "@/store/slices/user/types";
import { useEffect } from "react";

export function SettingsGeneral() {

    const isMusicON = useAppSelector(state => state.user.preferences.soundEnabled)
    const isNotificationON = useAppSelector(state => state.user.preferences.notifications)
    const language = useAppSelector(state => state.user.preferences.language)
    const languages = useAppSelector(state => state.astro.languages)
    const dispatch = useAppDispatch()
    const { changeLanguage, t } = useTranslation();

    const handleMusicToggle = () => {
        dispatch(userActions.setSoundEnabled(!isMusicON))
    }

    const handleNotificationToggle = () => {
        dispatch(userActions.setNotifications(!isNotificationON))
    }

    useEffect(() => {
        const fetchLanguages = async () => {
            await dispatch(astroActions.getLanguages())
        }

        fetchLanguages();
    }, [dispatch])

    const handleLanguageChange = (value: string) => {
        changeLanguage(value)
        dispatch(userActions.setLanguage(value as UserPreferences['language']))
    }

    return (
        <Section className="flex flex-col gap-9 m-0 z-50">
            <SectionTitle anchor="left" className="mb-9" >{t('settings-page.general.title')}</SectionTitle>
            <OptionToggler className="mb-6" title={t('settings-page.general.music') || 'Music'} description={t('settings-page.general.musicDesc') || 'Turn sound on and off'} isOn={isMusicON} onChange={handleMusicToggle} />
            <OptionToggler title={t('settings-page.general.push') || 'Push Notifications'} description={t('settings-page.general.pushDesc') || 'Receive daily insights and reminders'} isOn={isNotificationON} onChange={handleNotificationToggle} />
            <div className="flex justify-between items-center">
                <div className="flex flex-col items-start gap-1">
                    <h3 className="text-white text-sm">{t('settings-page.general.language')}</h3>
                    <span className="text-white/70 text-xs">{t('settings-page.general.languageHint')}</span>
                </div>
                <Select
                    className="backdrop-blur-md"
                    options={languages}
                    value={language}
                    onChange={handleLanguageChange}
                />
            </div>
        </Section>
    )
}