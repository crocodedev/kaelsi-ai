import Image from "next/image"
import FullMoonIcon from "@/assets/icons/moons/full-moon.svg"

import TarotIcon from "@/assets/icons/explore/tarot.svg"
import TarotIconActive from "@/assets/icons/explore/active/tarot-active.svg"

import CompatIcon from "@/assets/icons/explore/compact.svg"
import CompatIconActive from "@/assets/icons/explore/active/1+1-active.svg"

import NatalChartIcon from "@/assets/icons/explore/natal-chart.svg"
import NatalChartIconActive from "@/assets/icons/explore/active/natal-chart-active.svg"

import DestinyMatrixIcon from "@/assets/icons/explore/destiny-matrix.svg"
import DestinyMatrixIconActive from "@/assets/icons/explore/active/destiny-matrix-active.svg"

import HomeIcon from "@/assets/icons/explore/home.svg"
import HomeIconActive from "@/assets/icons/explore/active/home-active.png"

import CalendarIcon from "@/assets/icons/forms/calendar.svg"
import ChevronIcon from "@/assets/icons/forms/chevron.svg"

export const ICONS = {
    fullMoon: FullMoonIcon,
    tarot: TarotIcon,
    tarotActive: TarotIconActive,
    compat: CompatIcon,
    compatActive: CompatIconActive,
    natalChart: NatalChartIcon,
    natalChartActive: NatalChartIconActive,
    destinyMatrix: DestinyMatrixIcon,
    destinyMatrixActive: DestinyMatrixIconActive,
    home: HomeIcon,
    homeActive: HomeIconActive,
    calendar: CalendarIcon,
    chevron: ChevronIcon
} as const

export function Icon({ name, width = 28, height = 28, className }: { name: keyof typeof ICONS, width?: number, height?: number, className?: string }) {
    return (
        <Image src={ICONS[name]} alt={name} width={width} height={height} className={className} />
    )
}