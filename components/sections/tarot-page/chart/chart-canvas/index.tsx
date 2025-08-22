'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Application, Container, Sprite, Assets, Texture } from 'pixi.js';
import { Matrix } from '@/store/slices/tarot/state';
import BackgroundIconCard from "@/assets/cards/background-card.jpg";
import { usePreloadingContext } from '@/contexts/animation';
import { tarotActions, useAppDispatch, useAppSelector } from '@/store';
import { Spine } from '@pixi/spine-pixi';
import { ANIMATION_ALIASES } from '@/contexts/animation/helpers';
import { TarotCard } from '@/lib/types/astro-api';
import { PixiAppManager } from '@/lib/services/pixi-app-manager';

interface ChartCanvasProps {
    matrix: Matrix;
    cards: Record<string, TarotCard>;
}

const MIN_CARD_WIDTH = 60;
const MIN_CARD_HEIGHT = 110;
const TARGET_CARD_WIDTH = 120;
const TARGET_CARD_HEIGHT = 200;
const CARD_PADDING = 20;

function ChartCanvasComponent({ matrix, cards }: ChartCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application | null>(null);
    const cardsContainerRef = useRef<Container | null>(null);
    const shuffleRef = useRef<Spine | null>(null);
    const [showCards, setShowCards] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isAppReady, setIsAppReady] = useState(false);
    const [shufflePosition, setShufflePosition] = useState({ x: 0, y: 0 });
    const [isCardsLoading, setIsCardsLoading] = useState(true);
    const isFirstAnimationDone = useAppSelector(state => state.tarot.isFirstAnimationDone);
    const dispatch = useAppDispatch();
    const { atlasArray, skeletonArray, isPreloadingFinish } = usePreloadingContext();
    const containerIdRef = useRef<string>('');

    useEffect(() => {
        if (containerRef.current && !containerIdRef.current) {
            containerIdRef.current = `chart-canvas-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
    }, []);

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
        if (!containerRef.current || !containerIdRef.current) {
            return;
        }

        if (appRef.current) {
            return;
        }

        const pixiManager = PixiAppManager.getInstance();
        
        if (pixiManager.hasApp(containerIdRef.current)) {
            const existingApp = pixiManager.getApp(containerIdRef.current);
            if (existingApp) {
                appRef.current = existingApp;
                setIsAppReady(true);
                return;
            }
        }

        if (appRef.current) {
            return;
        }

        if (containerRef.current.children.length > 0) {
            containerRef.current.innerHTML = '';
        }

        const app = new Application();
        await app.init({
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
            backgroundAlpha: 0,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        cardsContainerRef.current = new Container();
        cardsContainerRef.current.visible = false;
        app.stage.addChild(cardsContainerRef.current);

        containerRef.current.appendChild(app.canvas);
        appRef.current = app;
        
        pixiManager.setApp(containerIdRef.current, app, containerRef.current);
        
        setIsAppReady(true);
    }, []);

    const getCardPosition = useCallback((x: number, y: number) => {
        const cardPosX = x * (MIN_CARD_WIDTH + CARD_PADDING);
        const cardPosY = y * (MIN_CARD_HEIGHT + CARD_PADDING);
        return { x: cardPosX, y: cardPosY };
    }, []);

    const createCard = useCallback(async (cardKey: string) => {
        if (!cardsContainerRef.current) return;

        const cardGraphics = new Container();

        try {
            const cardData = cards[cardKey];
            if (!cardData) {
                throw new Error(`Card data not found for key: ${cardKey}`);
            }

            const cardTexture = await Assets.load(cardData.image);
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
    }, [cards]);

    const createAllCards = useCallback(async () => {
        if (!cardsContainerRef.current) return;

        cardsContainerRef.current.visible = true;
        cardsContainerRef.current.alpha = 0;
        cardsContainerRef.current.removeChildren();

        const { scale, offsetX, offsetY } = calculateOptimalView();

        cardsContainerRef.current.scale.set(scale);
        cardsContainerRef.current.position.x = offsetX;
        cardsContainerRef.current.position.y = offsetY;

        const containerWidth = appRef.current?.screen.width || 800;
        const containerHeight = appRef.current?.screen.height || 800;
        const startX = containerWidth / 2 - 90;
        const startY = containerHeight / 2 + 75;

        const fadeInDuration = 500;
        const fadeInStartTime = Date.now();

        const fadeIn = () => {
            const elapsed = Date.now() - fadeInStartTime;
            const progress = Math.min(elapsed / fadeInDuration, 1);

            if (cardsContainerRef.current) {
                cardsContainerRef.current.alpha = progress;
            }

            if (progress < 1) {
                requestAnimationFrame(fadeIn);
            }
        };

        requestAnimationFrame(fadeIn);

        for (let index = 0; index < matrix.length; index++) {
            const cardKeys = Object.keys(cards);
            const cardKey = cardKeys[index] || index.toString();

            const cardData = await createCard(cardKey);

            if (cardData) {
                const { container, front, back } = cardData;
                back.zIndex = 1;
                front.zIndex = 2;

                container.position.x = startX;
                container.position.y = startY;
                container.alpha = 1;
            }
        }

        setTimeout(() => {
            const startTime = Date.now();
            const moveDuration = 400;
            const flipDelay = 200;

            const animateAllCards = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / moveDuration, 1);

                const easeOut = 1 - Math.pow(1 - progress, 3);

                if (cardsContainerRef.current) {
                    cardsContainerRef.current.children.forEach((container, index) => {
                        const cardPos = matrix[index];
                        const finalPosition = getCardPosition(cardPos.x, cardPos.y);

                        container.position.x = startX + (finalPosition.x - startX) * easeOut;
                        container.position.y = startY + (finalPosition.y - startY) * easeOut;
                    });
                }

                if (progress < 1) {
                    requestAnimationFrame(animateAllCards);
                } else {
                    setTimeout(() => {
                        const flipStartTime = Date.now();
                        const flipDuration = 1000;

                        const animateAllFlips = () => {
                            const flipElapsed = Date.now() - flipStartTime;
                            const flipProgress = Math.min(flipElapsed / flipDuration, 1);

                            const flipEase = 1 - Math.pow(1 - flipProgress, 3);

                            if (cardsContainerRef.current) {
                                cardsContainerRef.current.children.forEach((container) => {
                                    const scaleX = 1.2 - flipEase * 0.4;
                                    container.scale.x = scaleX;

                                    if (flipProgress >= 0.5) {
                                        const front = container.children[1];
                                        const back = container.children[0];
                                        if (front && back) {
                                            front.visible = true;
                                            back.visible = false;
                                        }
                                    }
                                });
                            }

                            if (flipProgress < 1) {
                                requestAnimationFrame(animateAllFlips);
                            } else {
                                if (cardsContainerRef.current) {
                                    cardsContainerRef.current.children.forEach((container) => {
                                        container.scale.x = 1;
                                    });
                                }
                            }
                        };

                        requestAnimationFrame(animateAllFlips);
                    }, flipDelay);
                }
            };

            requestAnimationFrame(animateAllCards);
        }, 250);
    }, [matrix, createCard, getCardPosition, calculateOptimalView, shufflePosition, cards]);

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

            const firstCardPos = matrix[0];
            const firstCardFinalPos = getCardPosition(firstCardPos.x, firstCardPos.y);

            const startScale = cardsContainerRef.current.scale.x;
            const startX = cardsContainerRef.current.position.x;
            const startY = cardsContainerRef.current.position.y;

            const targetX = containerWidth / 2 - firstCardFinalPos.x * targetScale;
            const targetY = containerHeight / 2 - firstCardFinalPos.y * targetScale;

            const startTime = Date.now();
            const duration = 1000;

            const animateZoom = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeOut = 1 - Math.pow(1 - progress, 3);

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
    }, [matrix, getCardPosition]);

    const loadShuffle = useCallback(async () => {
        if (!skeletonArray || !atlasArray || skeletonArray.length === 0 || atlasArray.length === 0) {
            console.warn('Skeleton or atlas arrays are not ready');
            return;
        }

        if (!appRef.current || shuffleRef.current) {
            return;
        }

        const skeletonItem = skeletonArray.find(item => item.alias.includes(ANIMATION_ALIASES.SHUFFLE));
        const atlasItem = atlasArray.find(item => item.alias.includes(ANIMATION_ALIASES.SHUFFLE + '_atlas'));

        if (!skeletonItem || !atlasItem) {
            console.warn('Required skeleton or atlas not found for shuffle animation');
            return;
        }

        const skeletonAlias = skeletonItem.alias;
        const atlasAlias = atlasItem.alias;

        if (!skeletonAlias || !atlasAlias) {
            console.warn('Skeleton or atlas aliases are undefined');
            return;
        }

        try {
            const preloadCards = async () => {
                if (!cards) return;

                const cardKeys = Object.keys(cards);
                const preloadPromises = cardKeys.map(async (cardKey) => {
                    try {
                        const cardData = cards[cardKey];
                        if (cardData?.image) {
                            await Assets.load(cardData.image);
                        }
                    } catch (error) {
                        console.warn(`Failed to preload card ${cardKey}:`, error);
                    }
                });

                await Promise.all(preloadPromises);
                setIsCardsLoading(false);
            };

            preloadCards();

            const { scale } = calculateOptimalView();

            if (!skeletonAlias || !atlasAlias) {
                throw new Error('Skeleton or atlas aliases are invalid');
            }

            const spine = Spine.from({
                skeleton: skeletonAlias,
                atlas: atlasAlias,
                scale: scale,
            });

            shuffleRef.current = spine;

            const startTime = Date.now();
            const duration = 1000;

            const animateZoomOut = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                if (shuffleRef.current) {
                    shuffleRef.current.scale.set(scale * progress);
                }

                if (progress < 1) {
                    requestAnimationFrame(animateZoomOut);
                }
            }

            if (shuffleRef.current && shuffleRef.current.skeleton) {
                if (appRef.current) {
                    const shuffleX = appRef.current.screen.width / 2;
                    const shuffleY = appRef.current.screen.height / 2;
                    shuffleRef.current.x = shuffleX;
                    shuffleRef.current.y = shuffleY;
                    setShufflePosition({
                        x: shuffleX,
                        y: shuffleY
                    });
                }

                shuffleRef.current.skeleton.setSlotsToSetupPose();
                shuffleRef.current.visible = true;

                if (appRef.current?.stage) {
                    appRef.current.stage.addChild(shuffleRef.current);

                    if (shuffleRef.current.state) {
                        shuffleRef.current.state.setAnimation(0, 'animation3', false);

                        const animationDuration = 2900;

                        setTimeout(() => {
                            dispatch(tarotActions.setIsFirstAnimationDone(true));
                        }, animationDuration);
                    }
                }
            }
        } catch (error) {
            console.error('Error creating spine animation:', error);
            if (cards) {
                const preloadCards = async () => {
                    const cardKeys = Object.keys(cards);
                    const preloadPromises = cardKeys.map(async (cardKey) => {
                        try {
                            const cardData = cards[cardKey];
                            if (cardData?.image) {
                                await Assets.load(cardData.image);
                            }
                        } catch (error) {
                            console.warn(`Failed to preload card ${cardKey}:`, error);
                        }
                    });

                    await Promise.all(preloadPromises);
                    setIsCardsLoading(false);
                };
                preloadCards();
            }
        }
    }, [skeletonArray, atlasArray, dispatch, cards, calculateOptimalView]);

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
        if (isPreloadingFinish && !appRef.current) {
            initPixiApp();
        }

        return () => {
            if (shuffleRef.current) {
                try {
                    if (appRef.current?.stage) {
                        appRef.current.stage.removeChild(shuffleRef.current);
                    }
                    shuffleRef.current.destroy();
                    shuffleRef.current = null;
                } catch (e) {
                    console.error(e);
                }
            }
            if (containerIdRef.current) {
                const pixiManager = PixiAppManager.getInstance();
                pixiManager.removeApp(containerIdRef.current);
                appRef.current = null;
            }
        };
    }, [isPreloadingFinish, initPixiApp]);

    useEffect(() => {
        setShowCards(false);
        setIsCardsLoading(true);
        setIsAppReady(false);
        
        if (appRef.current && containerIdRef.current) {
            const pixiManager = PixiAppManager.getInstance();
            pixiManager.removeApp(containerIdRef.current);
            appRef.current = null;
        }
    }, [matrix, cards]);

    useEffect(() => {
        if (isPreloadingFinish && isAppReady && !isFirstAnimationDone && !shuffleRef.current) {
            loadShuffle();
        }
    }, [isPreloadingFinish, isAppReady, isFirstAnimationDone, loadShuffle]);

    useEffect(() => {
        if (isPreloadingFinish && isAppReady && !isFirstAnimationDone && cards) {
            const timeout = setTimeout(() => {
                if (!shuffleRef.current) {
                    const preloadCards = async () => {
                        const cardKeys = Object.keys(cards);
                        const preloadPromises = cardKeys.map(async (cardKey) => {
                            try {
                                const cardData = cards[cardKey];
                                if (cardData?.image) {
                                    await Assets.load(cardData.image);
                                }
                            } catch (error) {
                                console.warn(`Failed to preload card ${cardKey}:`, error);
                            }
                        });

                        await Promise.all(preloadPromises);
                        setIsCardsLoading(false);
                        dispatch(tarotActions.setIsFirstAnimationDone(true));
                    };
                    preloadCards();
                }
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [isPreloadingFinish, isAppReady, isFirstAnimationDone, cards, dispatch]);

    useEffect(() => {
        if (isFirstAnimationDone && shuffleRef.current && appRef.current?.stage) {
            const fadeOutDuration = 250;
            const startTime = Date.now();

            const fadeOut = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / fadeOutDuration, 1);

                if (shuffleRef.current) {
                    shuffleRef.current.alpha = 1 - progress;
                }

                if (progress < 1) {
                    requestAnimationFrame(fadeOut);
                } else {
                    if (shuffleRef.current && appRef.current?.stage) {
                        appRef.current.stage.removeChild(shuffleRef.current);
                        shuffleRef.current.destroy();
                        shuffleRef.current = null;
                    }
                }
            };

            requestAnimationFrame(fadeOut);
        }
    }, [isFirstAnimationDone]);

    useEffect(() => {
        if (isFirstAnimationDone && matrix.length > 0 && !isCardsLoading && !showCards) {
            setTimeout(async () => {
                await createAllCards();
                setShowCards(true);
            }, 750);
        }
    }, [isFirstAnimationDone, matrix, createAllCards, isCardsLoading, showCards]);

    useEffect(() => {
        if (showCards && matrix.length > 0) {
            setTimeout(() => {
                zoomToFirstCard();
            }, 3500);
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

    useEffect(() => {
        return () => {
            const pixiManager = PixiAppManager.getInstance();
            pixiManager.cleanup();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative w-full overflow-hidden h-2/3 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={resetToOptimalView}
        />
    );
}

export const ChartCanvas = React.memo(ChartCanvasComponent);