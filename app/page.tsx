"use client"

import CardOfTheDay from "@/components/sections/home-page/card-of-the-day"
import { Explore } from "@/components/sections/home-page/explore"
import { Categories } from "@/components/sections/home-page/history"
import { Main } from "@/components/main"
import { useEffect } from "react"
import { prefetchEssentialData } from "@/lib/utils/data-prefetch"
import { useAuth } from "@/hooks/useAuth"
import { astroActions, tarotActions, useAppDispatch, useAppSelector } from "@/store"
import i18n from "@/lib/i18n"

let isPrefetched = false;
let REQUEST_SENDED = false;

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.tarot.categories);

  useEffect(() => {
    if (!isPrefetched && isAuthenticated) {
      prefetchEssentialData();
      isPrefetched = true;
    }
  }, [isAuthenticated]);


  const fetchCategories = async () => {
    if (categories || REQUEST_SENDED) return;
    REQUEST_SENDED = true;
    await dispatch(tarotActions.getTarotCategories({ page: 1, per_page: 7 }));
  }


  const refetchCategories = async () => {
    await dispatch(tarotActions.getTarotCategories({ page: 1, per_page: 7 }));
  }

  useEffect(() => {
    if (!categories) {
      fetchCategories();
    } else {
      refetchCategories();
    }
  }, [i18n.language]);

  return (
    <Main className="flex flex-col gap-5 px-5">
      <CardOfTheDay />
      <Explore />
      <Categories />
    </Main>
  )
}
