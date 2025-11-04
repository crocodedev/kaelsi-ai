"use client"

import { Icon } from "@/components/ui/icon/Icon"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/useTranslation"
import { useState, useEffect } from "react"
import { SettingsModal } from "../modals/settings"

export function Header() {
  const router = useRouter()
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [opacity, setOpacity] = useState(1)

  const toggleModal = () => setIsModalOpen(prev => !prev)

  useEffect(() => {
    const scrollContainer = document.querySelector("main")
    if (!scrollContainer) return

    const handleScroll = () => {
      const scrollTop = (scrollContainer as HTMLElement).scrollTop
      const fadeStart = 0
      const fadeEnd = 90 

      const progress = Math.min(Math.max((scrollTop - fadeStart) / (fadeEnd - fadeStart), 0), 1)
      setOpacity(1 - progress)
    }

    scrollContainer.addEventListener("scroll", handleScroll)
    return () => scrollContainer.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className="absolute top-0 left-0 z-20 flex w-full items-center justify-between bg-transparent p-10 gap-4 transition-opacity duration-300"
      style={{ opacity }}
    >
      <div className="column">
        <Icon name="fullMoon" height={32} width={32} />
      </div>

      <div className="column">
        <h2 className="text-sm font-normal text-gradient">{t("header.title")}</h2>
        <p className="text-xs text-white/70">{t("header.subtitle")}</p>
      </div>

      <div className="flex flex-col gap-1 p-2" onClick={toggleModal}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white rounded-full w-1 h-1" />
        ))}
      </div>

      <SettingsModal isOpen={isModalOpen} onClose={toggleModal} />
    </header>
  )
}
