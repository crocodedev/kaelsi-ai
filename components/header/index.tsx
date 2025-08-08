"use client"

import { Icon } from "@/components/ui/icon/Icon"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslation } from "@/hooks/useTranslation"


export function Header() {
  const router = useRouter()
  const { t } = useTranslation()

  const handleBackClick = () => {
    router.back()
  }

  return (
    <header className="flex items-center justify-between h-32 bg-transparent p-10 gap-4 gradient-shadow">
      <div className="column">
        <Icon name={'fullMoon'} height={32} width={32} />
      </div>
      <div className="column">
        <h2 className="text-sm font-normal text-gradient">{t('header.title')}</h2>
        <p className="text-xs text-white/70">{t('header.subtitle')}</p>
      </div>
      <div className="column">
        <Link className="text-white" href="/settings">:</Link>
      </div>
    </header>
  )
} 