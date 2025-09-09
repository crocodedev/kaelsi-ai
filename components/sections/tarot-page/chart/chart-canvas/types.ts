import { Matrix } from '@/store/slices/tarot/state';
import { TarotCard } from '@/lib/types/astro-api';

export type ChartCanvasProps = {
    matrix: Matrix;
    cards: Record<string, TarotCard>;
}


export type CardInfo = {
    image: string;
    label: string;
    description: string;
}