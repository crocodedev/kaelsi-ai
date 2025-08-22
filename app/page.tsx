"use client"

import { useTranslation } from "@/hooks/useTranslation"
import { CardOfTheDay } from "@/components/sections/home-page/card-of-the-day"
import { Explore } from "@/components/sections/home-page/explore"
import { History } from "@/components/sections/home-page/history"
import { Main } from "@/components/main"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <Main className="flex flex-col gap-5 px-5">
      <CardOfTheDay />
      <Explore />
      <History />
    </Main>
  )
}
