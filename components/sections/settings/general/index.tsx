import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { Select } from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";
import { Language } from "@/lib/types/astro-api";
import { astroActions, useAppDispatch, useAppSelector, userActions } from "@/store";
import { useEffect } from "react";

export function SettingsGeneral() {
    const language = useAppSelector(state => state.user.preferences.language)
    const languages = useAppSelector(state => state.astro.languages)
    const dispatch = useAppDispatch()
    const { changeLanguage, t } = useTranslation();

    useEffect(() => {
        const fetchLanguages = async () => {
            if (languages.length > 0) return;
            await dispatch(astroActions.getLanguages())
        }

        fetchLanguages();
    }, [dispatch])

    const handleLanguageChange = (value: string) => {
        changeLanguage(value)
        dispatch(userActions.setLanguage(value))
    }


    return (
        <Section className="flex flex-col m-0 z-50">
            <SectionTitle anchor="left" >{t('settings-page.general.title')}</SectionTitle>
            {/* <OptionToggler className="mb-6" title={t('settings-page.general.music') || 'Music'} description={t('settings-page.general.musicDesc') || 'Turn sound on and off'} isOn={isMusicON} onChange={handleMusicToggle} />
            <OptionToggler title={t('settings-page.general.push') || 'Push Notifications'} description={t('settings-page.general.pushDesc') || 'Receive daily insights and reminders'} isOn={isNotificationON} onChange={handleNotificationToggle} /> */}
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