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


import AnalystIcon from "@/assets/icons/tarot/ask-style/analyst.svg"
import PsychologistIcon from "@/assets/icons/tarot/ask-style/psychologist.svg"
import FriendIcon from "@/assets/icons/tarot/ask-style/friend.svg"
import WitchIcon from "@/assets/icons/tarot/ask-style/witch.svg"

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
    chevron: ChevronIcon,
    analyst: AnalystIcon,
    psychologist: PsychologistIcon,
    friend: FriendIcon,
    witch: WitchIcon
} as const

interface IconProps {
    name?: keyof typeof ICONS;
    src?: string;
    svg?: string;
    width?: number;
    height?: number;
    className?: string;
}

export function Icon({ name, width = 28, height = 28, svg, src, className }: IconProps) {

    const iconSrc = name ? ICONS[name] : src;

    if (svg) {
        return (
            <div className="flex justify-center items-center" style={{ width: width, height: height }} dangerouslySetInnerHTML={{ __html: svg }} />
        )
    }

    return (
        <div className="flex justify-center items-center" style={{ width: width, height: height }}>
            <Image src={iconSrc} alt={name || 'icon'} className={className} />
        </div>
    )
}