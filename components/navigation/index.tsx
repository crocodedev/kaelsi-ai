"use client"

import { Icon } from "@/components/ui/icon/Icon";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { AppState, useAppSelector, useAppDispatch } from "@/store";
import { actions } from "@/store/slices/ui";
import { useTranslation } from "@/hooks/useTranslation";


const NAV_ITEMS = [
    { id: 'tarot', link: '/tarot', icon: 'tarot', label: 'navigation.tarot', active: false, activeIcon: 'tarotActive' },
    { id: 'compat', link: '/compat', icon: 'compat', label: 'navigation.compat', active: false, activeIcon: 'compatActive' },
    { id: 'home', link: '/', icon: 'home', label: 'navigation.home', active: true, activeIcon: 'homeActive' },
    { id: 'natal-chart', link: '/natal-chart', icon: 'natalChart', label: 'navigation.natal', active: false, activeIcon: 'natalChartActive' },
    { id: 'destiny-matrix', link: '/destiny-matrix', icon: 'destinyMatrix', label: 'navigation.destiny', active: false, activeIcon: 'destinyMatrixActive' },
] as const;

export function Navigation() {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { activeItem, activeItemPosition } = useAppSelector((state: AppState) => state.ui.navigation);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentPath = pathname;
        const activeNavItem = NAV_ITEMS.find(item => item.link === currentPath);
        if (activeNavItem) {
            dispatch(actions.setActiveNavigationItem(activeNavItem.id));
        }
    }, [pathname, dispatch]);

    useEffect(() => {
        if (activeItem && containerRef.current) {
            const activeElement = containerRef.current.querySelector(`[data-item-id="${activeItem}"]`) as HTMLElement;
            if (activeElement) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const elementRect = activeElement.getBoundingClientRect();

                dispatch(actions.setActiveNavigationPosition({
                    left: elementRect.left - containerRect.left,
                    width: elementRect.width
                }));
            }
        }
    }, [activeItem, dispatch]);

    const handleItemClick = (itemId: string) => {
        const navItem = NAV_ITEMS.find(item => item.id === itemId);
        if (navItem) {
            dispatch(actions.setActiveNavigationItem(itemId));
            router.push(navItem.link);
        }
    };

    const getClipPath = () => {
        if (!activeItemPosition || !containerRef.current) return '';

        const containerWidth = containerRef.current.offsetWidth;
        const leftPercent = (activeItemPosition.left / containerWidth) * 100;
        const widthPercent = (activeItemPosition.width / containerWidth) * 100;

        const centerX = leftPercent + widthPercent / 2;
        const radius = 8;
        const maxDepth = 50;

        let points = [];

        points.push('0% 0%');

        points.push(`${centerX - radius}% 0%`);

        for (let i = 180; i >= 0; i--) {
            const angle = (i * Math.PI) / 180;
            const x = centerX + (radius * Math.cos(angle));
            const y = maxDepth * Math.sin(angle);
            points.push(`${x}% ${y}%`);
        }

        points.push(`${centerX + radius}% 0%`);

        points.push('100% 0%');
        points.push('100% 100%');
        points.push('0% 100%');

        return `polygon(${points.join(', ')})`;
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 m-5  rounded-[26px]">
            <div
                ref={containerRef}
                className="relative p-5  rounded-[26px] gradient-dark-section h-16 flex justify-between items-center px-6 "
                style={{ clipPath: getClipPath() }}
            >
                {NAV_ITEMS.map((item) => (
                    <div
                        key={item.id}
                        data-item-id={item.id}
                        onClick={handleItemClick.bind(null, item.id)}
                        className={`flex flex-col items-center gap-1 transition-transform duration-200  ${activeItem === item.id ? '-translate-y-3' : 'translate-y-5'}`}
                    >
                        <span className={`text-white text-xs transition-opacity duration-200 ${activeItem === item.id ? 'opacity-100 translate-y-6' : 'opacity-0'}`}>{t(item.label)}</span>
                    </div>
                ))}
            </div>

            <div
                className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-6 pb-6 "
            >
                {NAV_ITEMS.map((navItem) => (
                    <div
                        key={navItem.id}
                        data-item-id={navItem.id}
                        onClick={handleItemClick.bind(null, navItem.id)}
                        className="flex flex-col items-center gap-1 cursor-pointer"
                        style={{
                            transform: navItem.id === 'destiny-matrix' || navItem.id === 'natal-chart' ?
                                (activeItem === navItem.id ? 'translateY(-20px) translateX(-8px)' : 'translateY(5px) translateX(-8px)') :
                                (activeItem === navItem.id ? 'translateY(-20px)' : 'translateY(5px)'),
                            transition: 'transform 0.2s ease'
                        }}
                    >
                        <Icon
                            name={activeItem === navItem.id ? navItem.activeIcon : navItem.icon}
                            width={24}
                            height={24}
                        />
                    </div>
                ))}
            </div>
        </nav>
    )
}