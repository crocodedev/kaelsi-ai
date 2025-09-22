"use client"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { SubscriptionType, Plan } from "./types";
import { SubscriptionCard } from "./subscription-card";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector, userActions, authActions, astroActions } from "@/store";
import { Loader } from "../ui/loader";
import { useNotify } from "@/providers/notify-provider";
import { usePurchase } from "@/hooks/usePurchase";
import { PurchaseService } from "@/lib/services/purchase";


type SubscriptionProps = {
    className?: string;
    fullSize?: boolean;
}

export function Subscription({ className, fullSize = false }: SubscriptionProps) {
    const { t } = useTranslation();
    const isShowSubscriptionPurchase = useAppSelector(state => state.user.isShowSubscriptionPurchase);
    const subscription = useAppSelector(state => state.user.subscription);
    const isLoading = useAppSelector(state => state.astro.loading);
    const language = useAppSelector(state => state.user.preferences.language)
    const isUserInfoLoading = useAppSelector(state => state.auth.loading);
    const dispatch = useAppDispatch();
    const { isInitialized, purchaseProduct } = usePurchase();
    const plans = useAppSelector(state => state.astro.plans);
    const [subscriptionType, setSubscriptionType] = useState<SubscriptionType | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [nativePrice, setNativePrice] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const isSelected = Boolean(selectedPlan && selectedPlan?.id !== subscription?.plan?.id);
    const { notify } = useNotify();

    useEffect(() => {
        const fetchPlans = async () => {
            if (!isShowSubscriptionPurchase) return;
            if (!Array.isArray(plans) || plans.length === 0) {
                await dispatch(astroActions.getPlans());
            }
        }
        fetchPlans();
    }, [isShowSubscriptionPurchase, language, dispatch]);

    useEffect(() => {
        const currentPlanId = subscription?.plan?.id;
        if (selectedPlan || !currentPlanId) return;
        if (!Array.isArray(plans) || plans.length === 0) return;
        const typedPlans = plans as unknown as Plan[];
        const found = typedPlans.find(p => p.id === currentPlanId) || null;
        if (found) setSelectedPlan(found);
    }, [plans, subscription?.plan?.id, selectedPlan]);

    useEffect(() => {
        const loadNativePrice = async () => {
            try {
                setNativePrice(null);
                if (!isInitialized) return;
                const pid = selectedPlan?.google_pay_id;
                if (!pid) return;
                const pricing = await PurchaseService.getInstance().getProductPricing(String(pid));
                if (pricing.formatted) {
                    setNativePrice(pricing.formatted);
                    return;
                }
                if (pricing.priceNumber != null && pricing.currency) {
                    try {
                        const fmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: pricing.currency }).format(pricing.priceNumber);
                        setNativePrice(fmt);
                    } catch {
                        setNativePrice(`${pricing.priceNumber} ${pricing.currency}`);
                    }
                }
            } catch (e) {
                // ignore pricing errors to not block UI
                setNativePrice(null);
            }
        }
        loadNativePrice();
    }, [selectedPlan?.google_pay_id, isInitialized]);

    const handleCloseSubscription = () => {
        if (isLoading || isUserInfoLoading) return;
        dispatch(userActions.setShowSubscription(false));
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            handleCloseSubscription();
        }
    }

    const handleSelectTier = (plan: Plan) => {
        setSelectedPlan(plan)
    }

    if (!isShowSubscriptionPurchase) {
        return null;
    }


    const handleContinue = () => {
        if (!isInitialized) notify('error', t('common.error'))
        const updateSubscription = async () => {
            try {
                const productId = selectedPlan?.google_pay_id || undefined;
                if (!productId) {
                    notify('error', t('subscribe.rejected'))
                    return;
                }
                const isPurchased = await purchaseProduct(String(productId));
                if (isPurchased) {
                    dispatch(authActions.setLoading(true));
                    await dispatch(astroActions.subscribe(selectedPlan!.id))
                    await dispatch(authActions.getUser());
                    notify('success', t('subscribe.success'));
                    handleCloseSubscription();
                } else {
                    if (process.env.NODE_ENV !== 'production') {
                        notify('info', 'Исключение, для веб версии')
                        dispatch(authActions.setLoading(true));
                        await dispatch(astroActions.subscribe(selectedPlan!.id))
                        await dispatch(authActions.getUser());
                        notify('success', t('subscribe.success'));
                        handleCloseSubscription();
                        return;
                    }
                    notify('error', t('subscribe.rejected'));

                }
            } catch (error) {

                notify('error', t('subscribe.rejected') + error);
            }
        }

        updateSubscription();
    }

    if (isLoading || isUserInfoLoading) {
        return <Loader />
    }

    const buttonLabel = nativePrice || t('purchace.free');

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

                    {/* <div className="mb-6 w-full"> */}
                    {/*     <label className="text-white text-sm font-medium mb-3 block">{t('subscription.typeLabel')}</label> */}
                    {/*     <div className="flex w-full gap-2"> */}
                    {/*         <Button */}
                    {/*             variant={subscriptionType === "annual" ? "primary" : "outline"} */}
                    {/*             onClick={() => handleSelectSubscription("annual")} */}
                    {/*         > */}
                    {/*             {t('subscription.annual')} */}
                    {/*         </Button> */}
                    {/*         <Button */}
                    {/*             variant={subscriptionType === "monthly" ? "primary" : "outline"} */}
                    {/*             onClick={() => handleSelectSubscription("monthly")} */}
                    {/*         > */}
                    {/*             {t('subscription.monthly')} */}
                    {/*         </Button> */}
                    {/*     </div> */}
                    {/* </div> */}

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
                                isSelected={selectedPlan?.id === tier.id}
                                onClick={() => handleSelectTier(tier as unknown as Plan)}
                            />
                        ))}
                    </Container>

                    <Button onClick={handleContinue} disabled={Boolean(!isSelected)} className={`w-full ${isSelected && 'sticky bottom-0'}`}>
                        {t('subscription.continue')} {nativePrice ? `• ${buttonLabel}` : ''}
                    </Button>
                </Container>
            </div>
        </div>
    );
}
