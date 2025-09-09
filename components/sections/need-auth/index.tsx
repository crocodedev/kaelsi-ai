import { Section } from "@/components/layouts/section"
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";
import { cn } from "@/lib/utils";
import { authActions, useAppDispatch } from "@/store";
import { useTranslation } from "react-i18next"


type NeedAuthProps = {
    className?: string;
    title?: string;
}

export const NeedAuth = ({ className, title }: NeedAuthProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const handleAuth = () => {
        dispatch(authActions.setIsOpenModal(true));
    }

    return (
        <Section className={cn("flex flex-col gap-3 justify-between m-0 h-full", className)}>
            <SectionTitle>{title}</SectionTitle>
            <h2 className="text-white text-lg text-bold opacity-30 text-center mb-4">{t("auth.title")}</h2>
            <Button onClick={handleAuth}>{t('common.auth')}</Button>
        </Section>
    )
}