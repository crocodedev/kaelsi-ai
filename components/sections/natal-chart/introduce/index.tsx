"use client"

import { Container } from "@/components/container";
import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { Button } from "@/components/ui/button";

interface IntroduceProps {
    onProceed: () => void;
    title:string;
    textOne:string;
    textTwo:string;
}

export function Introduce({ onProceed, title, textOne, textTwo }: IntroduceProps) {

    const handleProceed = () => {
        onProceed();
    }

    return (
        <Section className="mb-20">
            <SectionTitle title={title} className="mb-6" />
            <Container className="gap-4 flex-col">
                <h3 className="text-white text-sm">
                    {textOne}
                </h3>
                <p className="text-white/70 text-sm">
                    {textTwo}
                </p>
                <Button onClick={handleProceed}>Proceed</Button>
            </Container>
        </Section>
    )
}