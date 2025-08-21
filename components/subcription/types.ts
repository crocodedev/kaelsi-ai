export type SubscriptionType = "annual" | "monthly";
export type SubscriptionTier = "basic" | "plus" | "premium";

export interface SubscriptionCardProps {
    tier: SubscriptionTier;
    title: string;
    price: string | number;
    originalPrice: string | number;
    benefits: string[];
    tag?: string;
    className?:string;
    isSelected?: boolean;
    onClick: () => void;
}

export type SubscriptionData = {
    [key in SubscriptionType]: SubscriptionTierData[];
};

export interface SubscriptionTierData {
    price: string;
    originalPrice: string;
    tag: string;
    benefits: string[];
}