import { Section } from "@/components/layouts/section";
import { SpreadContainer } from "@/components/sections/tarot-page/spread-container";
import { ThemeContainer } from "@/components/sections/tarot-page/theme-container";
import { SelectedData } from "./selected-data";
import { SectionTitle } from "@/components/ui/section-title";
import { Category } from "./category";
import { Chat } from "./chat";

export function TarotReading() {
    
    return (
        <Section className="flex flex-col gap-4">
            <SectionTitle className="mb-0">Tarot Reading</SectionTitle>
                <SelectedData/>
                <ThemeContainer />
                <SpreadContainer />
                <Category />
                <Chat />
        </Section>
    )
}