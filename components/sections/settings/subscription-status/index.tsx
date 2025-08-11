import { Section } from "@/components/layouts/section";
import { SubscriptionCard } from "@/components/subcription/subscription-card";
import { SectionTitle } from "@/components/ui/section-title";

import { SUBSCRIPTION_DATA } from "@/components/subcription/data";
import { SubscriptionTier } from "@/components/subcription/types";
import { Button } from "@/components/ui/button";
import { OptionToggler } from "@/components/ui/toggle/option-toggler";

export function SettingsSubscriptionStatus() {
    return (
        <Section className="w-full m-0">
            <SectionTitle anchor="left" className="mb-9" >Subscriptions</SectionTitle>
            <div className="mb-4">
                <h3 className="text-white text-sm">Current Active Subscription</h3>
                <span className="text-white/70 text-xs">Valid until 01/01/2025</span>
            </div>
            <SubscriptionCard
                className="purple-border mb-9"
                tier={SUBSCRIPTION_DATA.annual.plus.tier as SubscriptionTier}
                title={SUBSCRIPTION_DATA.annual.plus.title}
                price={SUBSCRIPTION_DATA.annual.plus.price}
                originalPrice={SUBSCRIPTION_DATA.annual.plus.originalPrice}
                benefits={SUBSCRIPTION_DATA.annual.plus.benefits}
                tag={'Active'}
                isSelected={false}
                onClick={() => { }}
            />

            <OptionToggler className="mb-6" title="Auto-Renewal" description="Disable or enable auto-renewal" />
            <div className="flex flex-col gap-6 w-full">
                <Button className="w-full">Upgrade Subscription</Button>
                <Button variant="outline" className="w-full">Cancel Subscription</Button>
            </div>
        </Section>
    )
}