
import mainBackground from '@/public/images/backgrounds/home-background.png'
import tarotBackground from '@/public/images/backgrounds/tarot-background.png'
import questsBackground from '@/public/images/backgrounds/quests-background.png'
import natalChartBackground from '@/public/images/backgrounds/natal-chart-background.png'
import destinyMatrixBackground from '@/public/images/backgrounds/destiny-matrix-background.png'


export const NAV_ITEMS = [
    { background: tarotBackground, id: 'tarot', link: '/tarot', icon: 'tarot', label: 'navigation.tarot', active: false, activeIcon: 'tarotActive' },
    { background: questsBackground, id: 'quests', link: '/quests', icon: 'quests', label: 'navigation.quests', active: false, activeIcon: 'questsActive' },
    { background: mainBackground, id: 'home', link: '/', icon: 'home', label: 'navigation.home', active: true, activeIcon: 'homeActive' },
    { background: natalChartBackground, id: 'natal-chart', link: '/natal-chart', icon: 'natalChart', label: 'navigation.natal', active: false, activeIcon: 'natalChartActive' },
    { background: destinyMatrixBackground, id: 'destiny-matrix', link: '/destiny-matrix', icon: 'destinyMatrix', label: 'navigation.destiny', active: false, activeIcon: 'destinyMatrixActive' },
] as const;