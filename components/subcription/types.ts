export type SubscriptionType = "annual" | "monthly";
export type SubscriptionTier = "basic" | "plus" | "premium";

export type SubscriptionCardProps = {
    tier: SubscriptionTier;
    title: string;
    isActive?: boolean;
    price: string | number;
    isMonthly?: boolean;
    originalPrice?: string | number;
    benefits: string[];
    tag?: string;
    className?: string;
    isSelected?: boolean;
    onClick: () => void;
}


export type SubscriptionData = {
    [key in SubscriptionType]: SubscriptionTierData[];
};

export type SubscriptionTierData = {
    id: number;
    google_pay_id: string | null;
    price: string;
    originalPrice: string;
    tag: string;
    benefits: string[];
}

export type OrderAdditional = {
    googlePlay: []
}

export type Plan = {
    id: number;
    order_additional: OrderAdditional
    google_pay_id: string | null;
    name: string;
    tier: SubscriptionTier;
    price: string | number;
    benefits: string[];
    tag: string;
}