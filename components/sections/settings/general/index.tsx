import { Section } from "@/components/layouts/section";
import { Toggle } from "@/components/ui/toggle";
import { SectionTitle } from "@/components/ui/section-title";
import { Select } from "@/components/ui/select";
import { OptionToggler } from "@/components/ui/toggle/option-toggler";

export function SettingsGeneral() {
    return (
        <Section className="flex flex-col gap-9 m-0 z-50">
        <SectionTitle anchor="left" className="mb-9" >General</SectionTitle>
        <OptionToggler className="mb-6" title="Music" description="Turn sound on and off" />
        <OptionToggler title="Push Notifications" description="Receive daily insights and reminders" />
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
                    { value: "de", label: "DE" },
                    { value: "it", label: "IT" },
                    { value: "pt", label: "PT" },
                    { value: "ru", label: "RU" }
                ]}
                value="en"
            />
        </div>
    </Section>
    )
}