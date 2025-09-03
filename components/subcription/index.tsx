"use client"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { SubscriptionType } from "./types";
import { SubscriptionCard } from "./subscription-card";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector, userActions, authActions, astroActions } from "@/store";
import { Loader } from "../ui/loader";
import { useNotify } from "@/providers/notify-provider";
import { Plan } from "@/lib/types/astro-api";


type SubscriptionProps = {
    className?: string;
    fullSize?: boolean;
}

export function Subscription({ className, fullSize = false }: SubscriptionProps) {
    const { t } = useTranslation();
    const isShowSubscriptionPurchase = useAppSelector(state => state.user.isShowSubscriptionPurchase);
    const subscription = useAppSelector(state => state.user.subscription);
    const isLoading = useAppSelector(state => state.astro.loading);
    const isUserInfoLoading = useAppSelector(state => state.auth.loading);
    const dispatch = useAppDispatch();
    const plans = useAppSelector(state => state.astro.plans);
    const [subscriptionType, setSubscriptionType] = useState<SubscriptionType | null>(null);
    const [selectedTierId, setSelectedTierId] = useState<number>(subscription?.plan?.id || 0);
    const containerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const isSelected = selectedTierId && selectedTierId !== subscription?.plan?.id
    const { notify } = useNotify();


    useEffect(() => {
        const fetchPlans = async () => {
            if (isShowSubscriptionPurchase) {
                await dispatch(astroActions.getPlans());
            }
        }
        fetchPlans();
    }, [isShowSubscriptionPurchase]);

    const handleCloseSubscription = () => {
        if (isLoading || isUserInfoLoading) return;
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
            try {
                dispatch(authActions.setLoading(true));
                await dispatch(astroActions.subscribe(selectedTierId))
                await dispatch(authActions.getUser());
                notify('success', 'Successfully subscribed');
                handleCloseSubscription();

            } catch (error) {
                notify('error', 'Failed to subscribe');
            }
        }

        updateSubscription();
    }


    if (isLoading || isUserInfoLoading) {
        return <Loader />
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
                        <p onClick={handleCloseSubscription} className="text-xl cursor-pointer text-white text-end">X</p>
                        <h1 className="text-purple-300 text-xl mb-6">{t('subscription.title')}</h1>

                        <h2 className="text-white text-sm text-start mb-4">{t('subscription.subtitle')}</h2>
                        <p className="text-white/70 text-sm text-start leading-relaxed">
                            {t('subscription.description')}
                        </p>
                    </div>

                    {/* <div className="mb-6 w-full">
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
                    </div> */}

                    <Container className="space-y-4 mb-8">
                        {plans?.map((tier: any) => (
                            <SubscriptionCard
                                className="w-full"
                                key={tier.id}
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

                    <Button onClick={handleContinue} className={`w-full ${isSelected && 'sticky bottom-0'}`}>
                        {t('subscription.continue')}
                    </Button>
                </Container>
            </div>
        </div>
    );
}
