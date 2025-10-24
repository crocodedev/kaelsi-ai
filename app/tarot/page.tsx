"use client"

import { TarotReading } from "@/components/sections/tarot-page";
import { Main } from "@/components/main";

export default function Tarot() {

  return (
    <Main className="overflow-hidden">
      <TarotReading />
    </Main>
  )
}