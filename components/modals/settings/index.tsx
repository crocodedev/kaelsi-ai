import { Section } from "@/components/layouts/section";
import { Modal } from "@/components/modals";
import { BirthForm } from "@/components/sections/natal-chart/birth-form";
import { Subscription } from "@/components/subcription";
import { SectionTitle } from "@/components/ui/section-title";
import { Toggle } from "@/components/ui/toggle";


type SettingsModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {

    return (
        <Modal className="bg-section-gradient/90 gradient-dark-section shadow-section p-5" isOpen={isOpen} onClose={onClose}>

            <div className="flex flex-col gap-8 max-h-screen overflow-y-auto py-10 hide-scrollbar scroll-smooth ">

                <div className="flex justify-between items-center">
                    <SectionTitle className="mb-0" anchor="left">Settings</SectionTitle>
                    <span className="text-white text-2xl">X</span>
                </div>
                <Section className="flex flex-col gap-9 m-0">
                    <SectionTitle anchor="left" className="mb-9" >General</SectionTitle>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col items-start gap-1">
                            <h3 className="text-white text-sm">Music</h3>
                            <span className="text-white/70 text-xs">Turn sound on and off</span>
                        </div>
                        <Toggle />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col items-start gap-1">
                            <h3 className="text-white text-sm">Push Notifications</h3>
                            <span className="text-white/70 text-xs">Receive daily insights and reminders</span>
                        </div>
                        <Toggle />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col items-start gap-1">
                            <h3 className="text-white text-sm">Language</h3>
                            <span className="text-white/70 text-xs">Choose your preferred language </span>
                        </div>
                        <select className="bg-transparent text-white">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="it">Italian</option>
                            <option value="pt">Portuguese</option>
                            <option value="ru">Russian</option>
                        </select>
                    </div>



                </Section>

                <Subscription fullSize />
                <BirthForm className="m-0 w-full"  onClose={onClose} onSave={() => { }} />
            </div>
        </Modal >
    )
}