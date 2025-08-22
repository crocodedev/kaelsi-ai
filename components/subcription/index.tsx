"use client"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { SUBSCRIPTION_DATA } from "./data";
import { SubscriptionType, SubscriptionTier } from "./types";
import { SubscriptionCard } from "./subscription-card";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector, userActions, purchaseActions, authActions } from "@/store";
import { Loader } from "../ui/loader";
import { useAstro } from "@/hooks/useAstro";
import { astroApiService } from "@/lib/services/astro-api";
import { useNotify } from "@/providers/notify-provider";


interface SubscriptionProps {
    className?: string;
    fullSize?: boolean;
}

export function Subscription({ className, fullSize = false }: SubscriptionProps) {
    const { t } = useTranslation();
    const isShowSubscriptionPurchase = useAppSelector(state => state.user.isShowSubscriptionPurchase);
    const subscription = useAppSelector(state => state.user.subscription);
    const dispatch = useAppDispatch();
    const plans = useAppSelector(state => state.purchase.subscriptions);
    const isLoading = useAppSelector(state => state.purchase.isLoading);
    const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>("annual");
    const [selectedTierId, setSelectedTierId] = useState<number>(subscription?.plan?.id || 0);
    const containerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const { notify } = useNotify();

    useEffect(() => {
        const fetchPlans = async () => {
            await dispatch(purchaseActions.getSubscriptions())
        }

        if (plans == null && !isLoading) fetchPlans();
    }, [plans, isLoading, dispatch])

    const handleSelectSubscription = (type: SubscriptionType) => {
        setSubscriptionType(type)
    }

    const handleCloseSubscription = () => {
        dispatch(userActions.setShowSubscription(false));
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            handleCloseSubscription();
        }
    }

    const handleSelectTier = (tier: number) => {
        setSelectedTierId(tier)
    }

    if (!isShowSubscriptionPurchase) {
        return null;
    }


    const handleContinue = () => {
        const updateSubscription = async () => {
            const response = await astroApiService.subscribe(selectedTierId);
            if (Object.hasOwn(response, "data")) {
                await dispatch(authActions.getUser());
                notify('success', 'Successfully subscribed');
            }
        }

        updateSubscription();

        handleCloseSubscription();
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                fullSize
                    ? "relative rounded-3xl bg-section-gradient/90 gradient-dark-section shadow-section backdrop-blur-md bg-mystical-bg p-5 w-full "
                    : "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
                className
            )}
            onClick={handleBackdropClick}
        >
            {isLoading && <Loader />}
            <div
                ref={modalRef}
                className={cn(
                    fullSize
                        ? "w-full"
                        : "w-full max-w-md mx-4 rounded-3xl bg-section-gradient/90 gradient-dark-section shadow-section backdrop-blur-md bg-mystical-bg p-5 max-h-[90vh] overflow-y-auto hide-scrollbar"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <Container className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-purple-300 text-xl mb-6">{t('subscription.title')}</h1>

                        <h2 className="text-white text-sm text-start mb-4">{t('subscription.subtitle')}</h2>
                        <p className="text-white/70 text-sm text-start leading-relaxed">
                            {t('subscription.description')}
                        </p>
                    </div>

                    <div className="mb-6 w-full">
                        <label className="text-white text-sm font-medium mb-3 block">{t('subscription.typeLabel')}</label>
                        <div className="flex w-full gap-2">
                            <Button
                                variant={subscriptionType === "annual" ? "primary" : "outline"}
                                onClick={() => handleSelectSubscription("annual")}
                            >
                                {t('subscription.annual')}
                            </Button>
                            <Button
                                variant={subscriptionType === "monthly" ? "primary" : "outline"}
                                onClick={() => handleSelectSubscription("monthly")}
                            >
                                {t('subscription.monthly')}
                            </Button>
                        </div>
                    </div>

                    <Container className="space-y-4 mb-8">
                        {plans?.map((tier: any) => (
                            <SubscriptionCard
                                className="w-full"
                                key={tier.tier}
                                tier={tier.tier}
                                isActive={subscription?.plan?.id == tier.id}
                                isMonthly={subscriptionType === "monthly"}
                                title={tier.name}
                                price={tier.price}
                                originalPrice={(tier.price * 1.2).toFixed(2)}
                                benefits={tier.benefits}
                                tag={tier.tag}
                                isSelected={selectedTierId === tier.id}
                                onClick={() => handleSelectTier(tier.id)}
                            />
                        ))}
                    </Container>

                    <Button onClick={handleContinue} className="w-full">
                        {t('subscription.continue')}
                    </Button>
                </Container>
            </div>
        </div>
    );
}
