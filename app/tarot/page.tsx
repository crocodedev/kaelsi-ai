"use client"

import { TarotReading } from "@/components/sections/tarot-page";
import { Main } from "@/components/main";
import PreloadingContext from "@/contexts/animation";

export default function Tarot() {
    return (
        <Main className="overflow-hidden">
            <PreloadingContext>

                <TarotReading />
            </PreloadingContext>
        </Main>
    )
}