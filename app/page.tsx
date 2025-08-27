"use client"

import { CardOfTheDay } from "@/components/sections/home-page/card-of-the-day"
import { Explore } from "@/components/sections/home-page/explore"
import { History } from "@/components/sections/home-page/history"
import { Main } from "@/components/main"
import { useEffect } from "react"
import { prefetchEssentialData } from "@/lib/utils/data-prefetch"
import { useAutoAuth } from "@/hooks/useAutoAuth"

let isPrefetched = false;

export default function HomePage() {
  const { isAuthenticated } = useAutoAuth();
  
  useEffect(() => {
    if (!isPrefetched && isAuthenticated) {
      prefetchEssentialData();
      isPrefetched = true;
    }
  }, []);

  return (
    <Main className="flex flex-col gap-5 px-5">
      <CardOfTheDay />
      <Explore />
      <History />
    </Main>
  )
}
