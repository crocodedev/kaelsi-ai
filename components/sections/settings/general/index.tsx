import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { Select } from "@/components/ui/select";
import { OptionToggler } from "@/components/ui/toggle/option-toggler";
import { useAppDispatch, useAppSelector, userActions } from "@/store";
import { UserPreferences } from "@/store/slices/user/types";

export function SettingsGeneral() {

    const isMusicON = useAppSelector(state => state.user.preferences.soundEnabled)
    const isNotificationON = useAppSelector(state => state.user.preferences.notifications)
    const language = useAppSelector(state => state.user.preferences.language)
    const dispatch = useAppDispatch()

    const handleMusicToggle = () => {
        dispatch(userActions.setSoundEnabled(!isMusicON))
    }

    const handleNotificationToggle = () => {
        dispatch(userActions.setNotifications(!isNotificationON))
    }

    const handleLanguageChange = (value: string) => {
        dispatch(userActions.setLanguage(value as UserPreferences['language']))
    }

    return (
        <Section className="flex flex-col gap-9 m-0 z-50">
            <SectionTitle anchor="left" className="mb-9" >General</SectionTitle>
            <OptionToggler className="mb-6" title="Music" description="Turn sound on and off" isOn={isMusicON} onChange={handleMusicToggle} />
            <OptionToggler title="Push Notifications" description="Receive daily insights and reminders" isOn={isNotificationON} onChange={handleNotificationToggle} />
            <div className="flex justify-between items-center">
                <div className="flex flex-col items-start gap-1">
                    <h3 className="text-white text-sm">Language</h3>
                    <span className="text-white/70 text-xs">Choose your preferred language </span>
                </div>
                <Select
                    className="backdrop-blur-md"
                    options={[
                        { value: "en", label: "EN" },
                        { value: "es", label: "ES" },
                        { value: "fr", label: "FR" },
                        { value: "ru", label: "RU" }
                    ]}
                    value={language}
                    onChange={handleLanguageChange}
                />
            </div>
        </Section>
    )
}