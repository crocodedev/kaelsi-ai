import { Section } from "@/components/layouts/section";
import { SubscriptionCard } from "@/components/subcription/subscription-card";
import { SectionTitle } from "@/components/ui/section-title";

import { SUBSCRIPTION_DATA } from "@/components/subcription/data";
import { SubscriptionTier } from "@/components/subcription/types";
import { Button } from "@/components/ui/button";
import { authActions, useAppDispatch, useAppSelector, userActions } from "@/store";
import { useTranslation } from "@/hooks/useTranslation";
import { useEffect } from "react";
import i18n from "@/lib/i18n";

export function SettingsSubscriptionStatus() {
    const subscription = useAppSelector(state => state.user.subscription);

    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        const refetchUserInfo = async () => {
            if (subscription)
                await dispatch(authActions.getUser())
        }
        refetchUserInfo();
    }, [i18n.language])


    const handleUpgradeSubscription = () => {
        dispatch(userActions.setShowSubscription(true))
    }

    const handleCancelSubscription = async () => {
        if (!subscription?.id) return;

        await dispatch(userActions.cancelSubscription(subscription.id))
    }

    return (
        <Section className="w-full m-0">
            <SectionTitle anchor="left" className="mb-9" >{t('settings-page.subscriptionStatus.title')}</SectionTitle>
            {subscription ? (<>
                <div className="mb-4">
                    <h3 className="text-white text-sm">{t('settings-page.subscriptionStatus.currentActive')}</h3>
                    <span className="text-white/70 text-xs">{t('subscription.active')} {t('common.until') || 'until'} {subscription.expires_at}</span>
                </div>
                <SubscriptionCard
                    className="purple-border mb-9"
                    tier={SUBSCRIPTION_DATA.annual.plus.tier as SubscriptionTier}
                    title={subscription.plan?.name || SUBSCRIPTION_DATA.annual.plus.title}
                    price={subscription.plan?.price || 0}
                    benefits={subscription.plan?.benefits || []}
                    tag={t('subscription.active')}
                    isSelected={false}
                    onClick={() => { }}
                />

                {/* <OptionToggler className="mb-6" title={t('settings-page.subscriptionStatus.autoRenewal') || 'Auto-Renewal'} description={t('settings-page.subscriptionStatus.autoRenewalDesc') || 'Disable or enable auto-renewal'} /> */}
                <div className="flex flex-col gap-6 w-full">
                    <Button onClick={handleUpgradeSubscription} className="w-full">{t('settings-page.subscriptionStatus.upgrade')}</Button>
                    {/* <Button variant="outline" onClick={handleCancelSubscription} className="w-full">{t('settings-page.subscriptionStatus.cancel')}</Button> */}
                </div>
            </>)
            : (
                <div className="w-full mt-1 flex grow flex-col gap-3 justify-center items-center rounded-lg h-40 hide-scrollbar">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"/>
                </div>
            )}
        </Section>
    )
}