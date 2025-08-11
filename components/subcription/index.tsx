"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { SUBSCRIPTION_DATA } from "./data";
import { SubscriptionType, SubscriptionTier } from "./types";
import { SubscriptionCard } from "./subscription-card";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";


interface SubscriptionProps {
    className?: string;
    fullSize?: boolean;
}

export function Subscription({ className, fullSize = false }: SubscriptionProps) {
    const { t } = useTranslation();
    const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>("annual");
    const [selectedTier, setSelectedTier] = useState<SubscriptionTier>("plus");


    const handleSelectSubscription = (type: SubscriptionType) => {
        setSubscriptionType(type)
    }

    const handleSelectTier = (tier: SubscriptionTier) => {
        setSelectedTier(tier)
    }


    return (
        <div className={cn(
            fullSize 
                ? "relative rounded-3xl bg-section-gradient/90 gradient-dark-section shadow-section backdrop-blur-md bg-mystical-bg p-5 w-full" 
                : "fixed bottom-0 z-10 rounded-3xl bg-section-gradient/90 gradient-dark-section shadow-section backdrop-blur-md h-[90vh] overflow-y-auto bg-mystical-bg p-5",
            className
        )}>
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
    );
}
