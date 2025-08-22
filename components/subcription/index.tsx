"use client"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { SUBSCRIPTION_DATA } from "./data";
import { SubscriptionType, SubscriptionTier } from "./types";
import { SubscriptionCard } from "./subscription-card";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector, userActions } from "@/store";


interface SubscriptionProps {
    className?: string;
    fullSize?: boolean;
}

export function Subscription({ className, fullSize = false }: SubscriptionProps) {
    const { t } = useTranslation();
    const isShowSubscriptionPurchase = useAppSelector(state => state.user.isShowSubscriptionPurchase);
    const dispatch = useAppDispatch();
    const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>("annual");
    const [selectedTier, setSelectedTier] = useState<SubscriptionTier>("plus");
    const containerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

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

    const handleSelectTier = (tier: SubscriptionTier) => {
        setSelectedTier(tier)
    }

    if (!isShowSubscriptionPurchase) {
        return null;
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
                        {Object.values(SUBSCRIPTION_DATA[subscriptionType]).map((tier: any) => (
                            <SubscriptionCard
                                key={tier.tier}
                                tier={tier.tier}
                                title={tier.title}
                                price={tier.price}
                                originalPrice={tier.originalPrice}
                                benefits={tier.benefits}
                                tag={tier.tag}
                                isSelected={selectedTier === tier.tier}
                                onClick={() => handleSelectTier(tier.tier)}
                            />
                        ))}
                    </Container>

                    <Button className="w-full">
                        {t('subscription.continue')}
                    </Button>
                </Container>
            </div>
        </div>
    );
}
