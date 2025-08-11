import { Modal } from "@/components/modals";
import { BirthForm } from "@/components/sections/natal-chart/birth-form";
import { SectionTitle } from "@/components/ui/section-title";
import { SettingsGeneral } from "@/components/sections/settings/general";
import { SettingsSubscriptionStatus } from "@/components/sections/settings/subscription-status";


type SettingsModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {

    return (
        <Modal className="bg-section-gradient/90  gradient-dark-section shadow-section p-5" isOpen={isOpen} >

            <div className="flex flex-col gap-8 max-h-screen overflow-y-auto py-10 hide-scrollbar scroll-smooth ">

                <div className="flex justify-between items-center">
                    <SectionTitle className="mb-0" anchor="left">Settings</SectionTitle>
                    <span className="text-white text-2xl" onClick={onClose}>X</span>
                </div>

                <SettingsGeneral />
                <SettingsSubscriptionStatus/>
                <BirthForm className="m-0 w-full" onClose={onClose} onSave={() => { }} />
            </div>
        </Modal >
    )
}