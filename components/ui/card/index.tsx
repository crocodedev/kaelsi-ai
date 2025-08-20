import Image from "next/image";
import { CardData, CARDS_DATA } from "./cards-data";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Coordinates } from "@/store/slices/tarot/types";

interface CardProps {
    card?: CardData;
    position?: Coordinates
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    initialPosition?: Coordinates
    index: number;
}


export function Card({
    card,
    width = 40,
    height = 40,
    className = "",
    index,
    position,
}: CardProps) {
    const src = card?.src || CARDS_DATA[0].src;
    const alt = card?.name || 'card';
    const [cardPosition, setCardPosition] = useState<Coordinates | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(true);

        const timer = setTimeout(() => {
            if (position)
                setCardPosition(position);
        }, 250 * index);

        return () => clearTimeout(timer)
    }, [])

    const style: React.CSSProperties = isReady ? {
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        left: `${cardPosition?.x}px`,
        top: `${cardPosition?.y}px`,
    } : {
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        left: `50%`,
        top: `50%`,
    };


    return (
        <Image
            style={style}
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cn(className, 'transition-all duration-1000')}
        />
    );
}