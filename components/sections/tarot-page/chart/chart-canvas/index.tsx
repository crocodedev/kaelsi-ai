'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Application, Container, Sprite, Assets, Texture, Point } from 'pixi.js';
import { Matrix } from '@/store/slices/tarot/state';
import { CARDS_DATA } from '@/components/ui/card/cards-data';
import BackgroundIconCard from "@/assets/cards/background-card.jpg";

interface ChartCanvasProps {
    matrix: Matrix;
    maxX: number;
    isShowingResults: boolean;
    maxY: number;
}

const MIN_CARD_WIDTH = 60;
const MIN_CARD_HEIGHT = 110;
const TARGET_CARD_WIDTH = 120;
const TARGET_CARD_HEIGHT = 200;
const CARD_PADDING = 20;
const MAX_DISTANCE = {
    maxX: 0,
    maxY: 0
}

let firstTime = true;

export function ChartCanvas({ matrix, isShowingResults }: ChartCanvasProps) {

    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application | null>(null);
    const cardsContainerRef = useRef<Container | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [showCards, setShowCards] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const calculateMaxCoordinates = useCallback(() => {
        let maxX = 0;
        let maxY = 0;
        let minX = 0;
        let minY = 0;

        matrix.forEach((cardPos) => {
            const cardPosX = cardPos.x * (MIN_CARD_WIDTH + CARD_PADDING);
            const cardPosY = cardPos.y * (MIN_CARD_HEIGHT + CARD_PADDING);

            maxX = Math.max(maxX, cardPosX);
            maxY = Math.max(maxY, cardPosY);
            minX = Math.min(minX, cardPosX);
            minY = Math.min(minY, cardPosY);
        });

        return { maxX, maxY, minX, minY };
    }, [matrix]);

    const calculateOptimalView = useCallback(() => {
        if (!containerRef.current) return { scale: 1, offsetX: 0, offsetY: 0 };

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const { maxX, maxY, minX, minY } = calculateMaxCoordinates();

        const totalWidth = maxX - minX + MIN_CARD_WIDTH;
        const totalHeight = maxY - minY + MIN_CARD_HEIGHT;

        const padding = 40;
        const scaleX = (containerWidth - padding) / totalWidth;
        const scaleY = (containerHeight - padding) / totalHeight;
        const optimalScale = Math.min(scaleX, scaleY, 1);

        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        const spreadCenterX = (maxX + minX) / 2;
        const spreadCenterY = (maxY + minY) / 2;

        const offsetX = centerX - spreadCenterX * optimalScale;
        const offsetY = centerY - spreadCenterY * optimalScale;

        return { scale: optimalScale, offsetX, offsetY };
    }, [calculateMaxCoordinates]);

    const initPixiApp = useCallback(async () => {
        if (!containerRef.current || appRef.current) return;

        if (containerRef.current.children.length > 0) {
            containerRef.current.innerHTML = '';
        }

        if(!firstTime) return;

        firstTime = false;

        const app = new Application();
        await app.init({
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
            backgroundAlpha: 0,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        const cardsContainer = new Container();
        app.stage.addChild(cardsContainer);
        cardsContainerRef.current = cardsContainer;

        containerRef.current.appendChild(app.canvas);
        appRef.current = app;

        setIsInitialized(true);
    }, []);

    const getCardPosition = useCallback((x: number, y: number) => {
        const cardPosX = x * (MIN_CARD_WIDTH + CARD_PADDING);
        const cardPosY = y * (MIN_CARD_HEIGHT + CARD_PADDING);
        if (MAX_DISTANCE.maxX < Math.abs(cardPosX)) {
            MAX_DISTANCE.maxX = cardPosX;
        }
        if (MAX_DISTANCE.maxY < cardPosY) {
            MAX_DISTANCE.maxY = cardPosY;
        }

        return { x: cardPosX, y: cardPosY };
    }, []);

    const createCard = useCallback(async () => {
        if (!cardsContainerRef.current) return;

        const cardGraphics = new Container();

        try {
            const cardTexture = await Assets.load(CARDS_DATA[0].src);
            const backTexture = await Assets.load(BackgroundIconCard);


            const cardSprite = new Sprite(cardTexture);
            const backSprite = new Sprite(backTexture);

            const scaleX = MIN_CARD_WIDTH / cardTexture.width;
            const scaleY = MIN_CARD_HEIGHT / cardTexture.height;
            const scale = Math.min(scaleX, scaleY);

            cardSprite.scale.set(scale);

            const backScaleX = MIN_CARD_WIDTH / backTexture.width;
            const backScaleY = MIN_CARD_HEIGHT / backTexture.height;
            const backScale = Math.min(backScaleX, backScaleY);
            backSprite.scale.set(backScale);

            cardSprite.anchor.set(0.5);
            backSprite.anchor.set(0.5);

            cardGraphics.addChild(backSprite);
            cardGraphics.addChild(cardSprite);

            cardSprite.visible = false;

            cardsContainerRef.current.addChild(cardGraphics);

            return { container: cardGraphics, front: cardSprite, back: backSprite };
        } catch (error) {
            const cardSprite = new Sprite(Texture.WHITE);
            const backSprite = new Sprite(Texture.WHITE);

            cardSprite.width = MIN_CARD_WIDTH;
            cardSprite.height = MIN_CARD_HEIGHT;
            cardSprite.tint = 0x8B4513;
            cardSprite.zIndex = 2;
            backSprite.width = MIN_CARD_WIDTH;
            backSprite.height = MIN_CARD_HEIGHT;
            backSprite.tint = 0x4A4A4A;
            backSprite.zIndex = 1;

            cardGraphics.addChild(backSprite);
            cardGraphics.addChild(cardSprite);

            cardSprite.visible = false;

            cardsContainerRef.current.addChild(cardGraphics);
            return { container: cardGraphics, front: cardSprite, back: backSprite };
        }
    }, [getCardPosition]);

    const createAllCards = useCallback(async () => {
        if (!cardsContainerRef.current) return;

        // Clear existing cards and reset container
        cardsContainerRef.current.removeChildren();
        cardsContainerRef.current.scale.set(1);
        cardsContainerRef.current.position.x = 0;
        cardsContainerRef.current.position.y = 0;

        const containerWidth = containerRef.current?.clientWidth || 800;
        const containerHeight = containerRef.current?.clientHeight || 800;
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;

        const { scale, offsetX, offsetY } = calculateOptimalView();

        setTimeout(() => {
            if (cardsContainerRef.current) {
                cardsContainerRef.current.scale.set(scale);
                cardsContainerRef.current.position.x = offsetX;
                cardsContainerRef.current.position.y = offsetY;
            }
        }, 100);

        for (let index = 0; index < matrix.length; index++) {
            const cardPos = matrix[index];
            const cardData = await createCard();

            if (cardData) {
                const { container, front, back } = cardData;
                back.zIndex = 1;
                front.zIndex = 2;

                const finalPosition = getCardPosition(cardPos.x, cardPos.y);

                container.position.x = centerX;
                container.position.y = centerY;
                container.alpha = 1;

                setTimeout(() => {
                    const startTime = Date.now();
                    const duration = 1200;

                    const animate = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        const easeOut = 1 - Math.pow(1 - progress, 3);

                        container.position.x = centerX + (finalPosition.x - centerX) * easeOut;
                        container.position.y = centerY + (finalPosition.y - centerY) * easeOut;

                        if (progress >= 0.8 && !front.visible) {
                            const flipProgress = (progress - 0.8) / 0.2;
                            const flipEase = 1 - Math.pow(1 - flipProgress, 3);

                            const scaleX = 1.2 - flipEase * 0.4;
                            container.scale.x = scaleX;

                            if (flipProgress >= 0.5) {
                                front.visible = true;
                                back.visible = false;
                            }
                        } else if (progress >= 1.0) {
                            container.scale.x = 1;
                            container.rotation = 0;
                        }

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };

                    requestAnimationFrame(animate);
                }, index * 300);
            }
        }
    }, [matrix, createCard, getCardPosition, calculateOptimalView]);



    const zoomToFirstCard = useCallback(() => {
        if (!cardsContainerRef.current || matrix.length === 0) return;

        const targetScale = Math.min(
            TARGET_CARD_WIDTH / MIN_CARD_WIDTH,
            TARGET_CARD_HEIGHT / MIN_CARD_HEIGHT
        );

        if (appRef.current) {
            const containerWidth = appRef.current?.screen.width || 800;
            const containerHeight = appRef.current?.screen.height || 800;

            if (!cardsContainerRef.current) return;

            const startScale = cardsContainerRef.current.scale.x;
            const startX = cardsContainerRef.current.position.x;
            const startY = cardsContainerRef.current.position.y;
            const targetX = containerWidth / 2;
            const targetY = containerHeight / 2;

            const startTime = Date.now();
            const duration = 250 * matrix.length;

            const animateZoom = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeOut = 1 - Math.pow(1 - progress, 1);

                const currentScale = startScale + (targetScale - startScale) * easeOut;
                const currentX = startX + (targetX - startX) * easeOut;
                const currentY = startY + (targetY - startY) * easeOut;

                if (cardsContainerRef.current) {
                    cardsContainerRef.current.scale.set(currentScale);
                    cardsContainerRef.current.position.x = currentX;
                    cardsContainerRef.current.position.y = currentY;
                }

                if (progress < 1) {
                    requestAnimationFrame(animateZoom);
                }
            };

            requestAnimationFrame(animateZoom);
        }
    }, [matrix]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        if (cardsContainerRef.current) {
            setDragStart({
                x: e.clientX - cardsContainerRef.current.position.x,
                y: e.clientY - cardsContainerRef.current.position.y
            });
        }
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isDragging && cardsContainerRef.current) {
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;

            cardsContainerRef.current.position.x = newX;
            cardsContainerRef.current.position.y = newY;
        }
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        if (!cardsContainerRef.current) return;

        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.1, Math.min(5, cardsContainerRef.current.scale.x * delta));

        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const containerScale = cardsContainerRef.current.scale.x;
        const containerX = cardsContainerRef.current.position.x;
        const containerY = cardsContainerRef.current.position.y;

        const containerMouseX = (mouseX - containerX) / containerScale;
        const containerMouseY = (mouseY - containerY) / containerScale;

        cardsContainerRef.current.scale.set(newScale);

        const newContainerX = mouseX - containerMouseX * newScale;
        const newContainerY = mouseY - containerMouseY * newScale;

        cardsContainerRef.current.position.x = newContainerX;
        cardsContainerRef.current.position.y = newContainerY;
    }, []);

    const resetToOptimalView = useCallback(() => {
        if (!cardsContainerRef.current) return;

        const { scale, offsetX, offsetY } = calculateOptimalView();

        cardsContainerRef.current.scale.set(scale);
        cardsContainerRef.current.position.x = offsetX;
        cardsContainerRef.current.position.y = offsetY;
    }, [calculateOptimalView]);

    useEffect(() => {
        initPixiApp();

        return () => {
            if (appRef.current) {
                appRef.current.destroy(true);
                appRef.current = null;
            }
            if (cardsContainerRef.current) {
                cardsContainerRef.current = null;
            }
        };
    }, [initPixiApp]);

    useEffect(() => {
        if (isInitialized && matrix.length > 0) {
            setTimeout(async () => {
                await createAllCards();
                setShowCards(true);
            }, 500);
        }
    }, [isInitialized, matrix, createAllCards]);

    useEffect(() => {
        if (showCards) {
            setTimeout(() => {
                zoomToFirstCard();
            }, matrix.length * 250 + 1500);
        }
    }, [showCards, matrix.length, zoomToFirstCard]);

    useEffect(() => {
        const handleResize = () => {
            if (appRef.current && containerRef.current) {
                appRef.current.renderer.resize(
                    containerRef.current.clientWidth,
                    containerRef.current.clientHeight
                );
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            return () => container.removeEventListener('wheel', handleWheel);
        }
    }, [handleWheel]);

    return (
        <div
            ref={containerRef}
            className={`relative w-full overflow-hidden h-2/3 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${isShowingResults ? 'h-full' : 'h-2/3'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={resetToOptimalView}
        />
    );
}