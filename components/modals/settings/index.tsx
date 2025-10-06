import { Modal } from "@/components/modals";
import { BirthForm } from "@/components/sections/natal-chart/birth-form";
import { SectionTitle } from "@/components/ui/section-title";
import { SettingsGeneral } from "@/components/sections/settings/general";
import { SettingsSubscriptionStatus } from "@/components/sections/settings/subscription-status";
import { authActions, useAppDispatch } from "@/store";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layouts/section";


type SettingsModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { isAuthenticated } = useAuth();
    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    const handleAuth = () => {
        dispatch(authActions.setIsOpenModal(true));
    }

    return (
        <Modal className="bg-section-gradient/90 justify-start items-start gradient-dark-section shadow-section p-5" isOpen={isOpen} >

            <div className="flex flex-col gap-8 w-full  max-h-screen overflow-y-auto py-10 hide-scrollbar scroll-smooth ">

                <div className="flex justify-between items-center">
                    <SectionTitle className="mb-0" anchor="left">{t('navigation.settings')}</SectionTitle>
                    <span className="text-white text-2xl cursor-pointer" onClick={onClose}>X</span>
                </div>

                <SettingsGeneral />
                {!isAuthenticated &&
                    <Section className="flex flex-col gap-3 justify-between m-0 h-full">
                        <p className="text-white text-lg text-bold opacity-30 text-center">{t('card-of-the-day.access-for-view-more-settings')}</p>
                        <Button onClick={handleAuth}>{t('common.auth')}</Button>
                    </Section>}
                {/* <SettingsOther /> */}
                
                {isAuthenticated && (<>
                    <SettingsSubscriptionStatus />
                    <BirthForm className="m-0 w-full" onClose={onClose} showOnlyInfo={true} />
                </>)}
            </div>
        </Modal >
    )
}