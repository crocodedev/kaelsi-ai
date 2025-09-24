import { AuthForm } from "@/components/auth";
import { Modal } from "@/components/modals";
import { authActions, useAppDispatch, useAppSelector } from "@/store";
import { useTranslation } from "react-i18next";


export function AuthModal() {
    const { t } = useTranslation();
    const isOpen = useAppSelector(state => state.auth.isOpenModal);
    const dispatch = useAppDispatch();

    const onClose = () => {
        dispatch(authActions.setIsOpenModal(false));
    }

    const handleSuccess = () => {
        dispatch(authActions.setIsOpenModal(false));
    }

    if (!isOpen) return null;

    return (
        <Modal className="bg-section-gradient/90  gradient-dark-section shadow-section p-5 flex-col" isOpen={isOpen}>
            <div className="flex justify-between items-center w-full px-5">
                <div className="flex w-full items-center justify-center">
                    <h1 className="text-2xl font-bold text-center text-white">{t('auth.welcomeTitle')}</h1>
                </div>
                <span className="text-white text-2xl cursor-pointer" onClick={onClose}>X</span>
            </div>

            <AuthForm onSuccess={handleSuccess} />
        </Modal >
    )
}