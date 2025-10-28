'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Application, Container, Sprite, Assets, Texture } from 'pixi.js';
import BackgroundIconCard from "@/assets/cards/background-card.jpg";
import { usePreloadingContext } from '@/contexts/animation';
import { tarotActions, useAppDispatch, useAppSelector } from '@/store';
import { Spine } from '@pixi/spine-pixi';
import { ANIMATION_ALIASES } from '@/contexts/animation/helpers';
import { PixiAppManager } from '@/lib/services/pixi-app-manager';
import { CardInfo, ChartCanvasProps } from './types';
import { CardInfoModal } from '@/components/modals/card-info';


const MIN_CARD_WIDTH = 60;
const MIN_CARD_HEIGHT = 110;
const TARGET_CARD_WIDTH = 120;
const TARGET_CARD_HEIGHT = 200;
const CARD_PADDING = 20;

export const ChartCanvas = ({ matrix, cards }: ChartCanvasProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application | null>(null);
    const cardsContainerRef = useRef<Container | null>(null);
    const [selectedCard, setSelectedCard] = useState<CardInfo | null>(null);
    const reading = useAppSelector(state => state.tarot.response?.reading)
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

    const isTouchDraggingRef = useRef(false);
    const touchStartRef = useRef({ x: 0, y: 0 });
    const pinchStartDistanceRef = useRef<number | null>(null);
    const pinchInitialScaleRef = useRef<number>(1);
    const pinchCenterRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (containerRef.current && !containerIdRef.current) {
            containerIdRef.current = `chart-canvas-${Date.now()}-${Math.random().toString(36)}`;
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

    const clampZoom = useCallback(() => {
        if (!cardsContainerRef.current || !containerRef.current) return;

        const { maxX, maxY, minX, minY } = calculateMaxCoordinates();
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const layoutWidth = (maxX - minX + MIN_CARD_WIDTH);
        const layoutHeight = (maxY - minY + MIN_CARD_HEIGHT);

        const scaleToFit = Math.min(
            containerWidth / (layoutWidth + CARD_PADDING * 2),
            containerHeight / (layoutHeight + CARD_PADDING * 2)
        );

        const maxScale = 1;

        const scale = cardsContainerRef.current.scale.x;

        const clampedScale = Math.min(Math.max(scale, scaleToFit), maxScale);

        if (clampedScale !== scale) {
            cardsContainerRef.current.scale.set(clampedScale);
        }

        return { scaleToFit, maxScale, clampedScale };
    }, [calculateMaxCoordinates]);

    const clampContainerPosition = useCallback(() => {
        if (!cardsContainerRef.current || !containerRef.current) return;

        const { maxX, maxY, minX, minY } = calculateMaxCoordinates();

        const scale = cardsContainerRef.current.scale.x || 1;
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const halfW = MIN_CARD_WIDTH / 2;
        const halfH = MIN_CARD_HEIGHT / 2;

        const scaledLeft = (minX - halfW) * scale;
        const scaledRight = (maxX + halfW) * scale;
        const scaledTop = (minY - halfH) * scale;
        const scaledBottom = (maxY + halfH) * scale;

        const leftConstraint = -scaledLeft;
        const rightConstraint = containerWidth - scaledRight;

        const topConstraint = -scaledTop;
        const bottomConstraint = containerHeight - scaledBottom;

        const clampMinX = Math.min(leftConstraint, rightConstraint);
        const clampMaxX = Math.max(leftConstraint, rightConstraint);
        const clampMinY = Math.min(topConstraint, bottomConstraint);
        const clampMaxY = Math.max(topConstraint, bottomConstraint);

        const pos = cardsContainerRef.current.position;
        pos.x = Math.min(Math.max(pos.x, clampMinX), clampMaxX);
        pos.y = Math.min(Math.max(pos.y, clampMinY), clampMaxY);
    }, [calculateMaxCoordinates]);

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
        if (!containerRef.current || !containerIdRef.current) return;
        if (appRef.current) return;

        const pixiManager = PixiAppManager.getInstance();

        if (pixiManager.hasApp(containerIdRef.current)) {
            const existingApp = pixiManager.getApp(containerIdRef.current);
            if (existingApp) {
                if ((existingApp as any).renderer?.destroyed) {
                    pixiManager.removeApp?.(containerIdRef.current);
                } else {
                    appRef.current = existingApp;
                    const found = appRef.current.stage.children.find(
                        c => (c as any).label === 'cardsContainer'
                    ) as Container | undefined;
                    if (found) {
                        cardsContainerRef.current = found;
                    } else {
                        const newC = new Container();
                        newC.label = 'cardsContainer';
                        newC.visible = false;
                        appRef.current.stage.addChild(newC);
                        cardsContainerRef.current = newC;
                    }

                    const appCanvas = (appRef.current as any).canvas || (appRef.current as any).view;
                    if (containerRef.current && appCanvas && !containerRef.current.contains(appCanvas)) {
                        containerRef.current.innerHTML = '';
                        containerRef.current.appendChild(appCanvas);
                    }

                    setIsAppReady(true);
                    return;
                }
            }
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

        const cardsC = new Container();
        cardsC.label = 'cardsContainer';
        cardsC.visible = false;
        app.stage.addChild(cardsC);

        containerRef.current.appendChild((app as any).canvas || (app as any).view);
        appRef.current = app;
        cardsContainerRef.current = cardsC;

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

            const handleClickOnCard = () => {
                const selectedCard = reading?.cards?.find(card => card.position.toString() == cardKey);

                setSelectedCard({
                    image: cardData.image,
                    label: selectedCard?.label || '',
                    description: selectedCard?.description || ''
                })
            }

            cardSprite.eventMode = 'static';
            cardSprite.cursor = 'pointer';
            cardSprite.on('pointertap', handleClickOnCard);

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
        clampZoom();
        cardsContainerRef.current.position.x = offsetX;
        cardsContainerRef.current.position.y = offsetY;
        clampContainerPosition();

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

                container.position.x = containerWidth / 2 + 85;
                container.position.y = (containerHeight - 75) / 2;

                container.alpha = 0;
                front.visible = false;
                back.visible = true;

                const fadeInStart = Date.now();
                const fadeInDuration = 500;

                const fadeInCard = () => {
                    const elapsed = Date.now() - fadeInStart;
                    const progress = Math.min(elapsed / fadeInDuration, 1);

                    container.alpha = progress;

                    if (progress < 1) {
                        requestAnimationFrame(fadeInCard);
                    }
                };

                const delayPerCard = 300;
                setTimeout(() => {
                    requestAnimationFrame(fadeInCard);
                }, delayPerCard);
            }
        }
        if (!isFirstAnimationDone) {
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
        } else {
            if (cardsContainerRef.current) {
                cardsContainerRef.current.children.forEach((container, index) => {
                    const cardPos = matrix[index];
                    const finalPosition = getCardPosition(cardPos.x, cardPos.y);
                    container.position.x = finalPosition.x;
                    container.position.y = finalPosition.y;
                    const front = container.children[1];
                    const back = container.children[0];
                    if (front && back) {
                        front.visible = true;
                        back.visible = false;
                    }
                });
            }
        }
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

    const loadShuffle = useCallback(async (retryCount = 0) => {
        if (retryCount > 5) {
            console.warn('Max retry attempts reached for shuffle animation');
            return;
        }

        if (!skeletonArray || !atlasArray || skeletonArray.length === 0 || atlasArray.length === 0) {
            console.warn('Skeleton or atlas arrays are not ready');
            return;
        }

        if (!appRef.current || shuffleRef.current) {
            return;
        }

        if (!appRef.current.stage || !appRef.current.renderer) {
            console.warn('PIXI app is not fully initialized yet');
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
            if (!skeletonAlias || !atlasAlias) {
                console.warn('Skeleton or atlas aliases are not ready yet, retrying in 100ms');
                setTimeout(() => {
                    if (!shuffleRef.current) {
                        loadShuffle(retryCount + 1);
                    }
                }, 100);
                return;
            }

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

            if (!skeletonAlias || !atlasAlias) return;

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

            cardsContainerRef.current.position.set(newX, newY);
            clampContainerPosition();
        }
    }, [isDragging, dragStart, clampContainerPosition]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        if (!cardsContainerRef.current || !containerRef.current) return;

        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const currentScale = cardsContainerRef.current.scale.x;
        const containerX = cardsContainerRef.current.position.x;
        const containerY = cardsContainerRef.current.position.y;

        const containerMouseX = (mouseX - containerX) / currentScale;
        const containerMouseY = (mouseY - containerY) / currentScale;

        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        let newScale = currentScale * delta;

        const { maxX, maxY, minX, minY } = calculateMaxCoordinates();
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const layoutWidth = maxX - minX + MIN_CARD_WIDTH;
        const layoutHeight = maxY - minY + MIN_CARD_HEIGHT;

        const scaleToFit = Math.min(
            containerWidth / (layoutWidth + CARD_PADDING * 2),
            containerHeight / (layoutHeight + CARD_PADDING * 2)
        );

        const maxScale = containerHeight / (MIN_CARD_HEIGHT + CARD_PADDING * 2);

        newScale = Math.min(Math.max(newScale, scaleToFit), maxScale);

        cardsContainerRef.current.scale.set(newScale);

        const newContainerX = mouseX - containerMouseX * newScale;
        const newContainerY = mouseY - containerMouseY * newScale;

        cardsContainerRef.current.position.set(newContainerX, newContainerY);

        clampContainerPosition();
    }, [calculateMaxCoordinates, clampContainerPosition]);


    const getDistance = (t1: Touch, t2: Touch) => {
        const dx = t2.clientX - t1.clientX;
        const dy = t2.clientY - t1.clientY;
        return Math.hypot(dx, dy);
    };

    const getCenter = (t1: Touch, t2: Touch, rect: DOMRect) => {
        const x = ((t1.clientX + t2.clientX) / 2) - rect.left;
        const y = ((t1.clientY + t2.clientY) / 2) - rect.top;
        return { x, y };
    };

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (!cardsContainerRef.current || !containerRef.current) return;
        const touches = (e.nativeEvent as TouchEvent).touches;
        if (touches.length === 1) {
            isTouchDraggingRef.current = true;
            const t = touches[0] as Touch;
            touchStartRef.current = {
                x: t.clientX - cardsContainerRef.current.position.x,
                y: t.clientY - cardsContainerRef.current.position.y
            };
            clampContainerPosition();
        } else if (touches.length === 2) {
            e.preventDefault();
            const rect = containerRef.current.getBoundingClientRect();
            const t1 = touches[0] as Touch;
            const t2 = touches[1] as Touch;
            pinchStartDistanceRef.current = getDistance(t1, t2);
            pinchInitialScaleRef.current = cardsContainerRef.current.scale.x;
            pinchCenterRef.current = getCenter(t1, t2, rect);
        }
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!cardsContainerRef.current || !containerRef.current) return;
        const touches = (e.nativeEvent as TouchEvent).touches;
        if (touches.length === 2 && pinchStartDistanceRef.current) {
            e.preventDefault();
            const rect = containerRef.current.getBoundingClientRect();
            const t1 = touches[0] as Touch;
            const t2 = touches[1] as Touch;
            const currentDistance = getDistance(t1, t2);
            const scaleFactor = currentDistance / pinchStartDistanceRef.current;
            const newScale = Math.max(0.1, Math.min(5, pinchInitialScaleRef.current * scaleFactor));

            const center = getCenter(t1, t2, rect);

            const containerScale = cardsContainerRef.current.scale.x;
            const containerX = cardsContainerRef.current.position.x;
            const containerY = cardsContainerRef.current.position.y;

            const containerCenterX = (center.x - containerX) / containerScale;
            const containerCenterY = (center.y - containerY) / containerScale;

            cardsContainerRef.current.scale.set(newScale);

            const newContainerX = center.x - containerCenterX * newScale;
            const newContainerY = center.y - containerCenterY * newScale;

            cardsContainerRef.current.position.x = newContainerX;
            cardsContainerRef.current.position.y = newContainerY;
            cardsContainerRef.current.scale.set(newScale);
            clampZoom();
            cardsContainerRef.current.position.set(newContainerX, newContainerY);
            clampContainerPosition();
        } else if (touches.length === 1 && isTouchDraggingRef.current) {
            const t = touches[0] as Touch;
            const newX = t.clientX - touchStartRef.current.x;
            const newY = t.clientY - touchStartRef.current.y;
            cardsContainerRef.current.position.x = newX;
            cardsContainerRef.current.position.y = newY;
            cardsContainerRef.current.position.set(newX, newY);
            clampContainerPosition();
        }
    }, [clampContainerPosition]);

    const resetToOptimalView = useCallback(() => {
        if (!cardsContainerRef.current) return;

        const { scale, offsetX, offsetY } = calculateOptimalView();

        cardsContainerRef.current.scale.set(scale);
        cardsContainerRef.current.position.x = offsetX;
        cardsContainerRef.current.position.y = offsetY;



    }, [calculateOptimalView]);

    const lastTapRef = useRef<number>(0);
    const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        isTouchDraggingRef.current = false;
        pinchStartDistanceRef.current = null;

        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapRef.current;

        if (tapLength < 300 && tapLength > 0) {
            e.preventDefault();
            resetToOptimalView();
            lastTapRef.current = 0;

            if (tapTimeoutRef.current) {
                clearTimeout(tapTimeoutRef.current);
                tapTimeoutRef.current = null;
            }
        } else {
            lastTapRef.current = currentTime;
            tapTimeoutRef.current = setTimeout(() => {
                lastTapRef.current = 0;
                tapTimeoutRef.current = null;
            }, 300);
        }
    }, [resetToOptimalView]);

    useEffect(() => {
        if (isPreloadingFinish && !appRef.current) {
            const initializeApp = async () => {
                await initPixiApp();
            };
            initializeApp();
        }

    }, [isPreloadingFinish, initPixiApp]);

    useEffect(() => {
        setShowCards(false);
        setIsCardsLoading(true);
        setIsAppReady(false);

        const initializeApp = async () => {
            await initPixiApp();
        };
        initializeApp();
    }, [matrix, cards]);


    useEffect(() => {
        if (isPreloadingFinish && isAppReady && !isFirstAnimationDone && !shuffleRef.current) {
            const timeout = setTimeout(() => {
                if (!shuffleRef.current) {
                    loadShuffle(0);
                }
            }, 100);

            return () => clearTimeout(timeout);
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
        if (!isAppReady) return;
        if (matrix.length > 0 && !isCardsLoading && !showCards) {
            const delay = isFirstAnimationDone ? 0 : 750;
            const timeout = setTimeout(async () => {
                await createAllCards();
                setShowCards(true);
            }, delay);

            return () => clearTimeout(timeout);
        }
    }, [isFirstAnimationDone, matrix, createAllCards, isCardsLoading, showCards, isAppReady]);

    useEffect(() => {
        if (showCards && matrix.length > 0 && !isFirstAnimationDone) {
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
        if (isPreloadingFinish && !appRef.current) {
            const initializeApp = async () => {
                await initPixiApp();
            };
            initializeApp();
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

        };
    }, [isPreloadingFinish, initPixiApp]);

    useEffect(() => {
        return () => {
            (async () => {
                if (appRef.current) {
                    try {
                        appRef.current.stage.removeChildren();


                        await appRef.current.destroy();

                    } catch (err) {
                        console.error('Error destroying Pixi app', err);
                    }

                    appRef.current = null;
                }

                cardsContainerRef.current = null;
                shuffleRef.current = null;
                setShowCards(false);
            })();
        };
    }, []);

    useEffect(() => {
        if (isFirstAnimationDone && isAppReady && cards) {
            let canceled = false;
            const preload = async () => {
                try {
                    const keys = Object.keys(cards);
                    const promises = keys.map(k => {
                        const img = cards[k]?.image;
                        return img ? Assets.load(img).catch(() => { }) : Promise.resolve();
                    });
                    await Promise.all(promises);
                    if (!canceled) setIsCardsLoading(false);
                } catch (e) {
                    if (!canceled) setIsCardsLoading(false);
                }
            };
            preload();
            return () => { canceled = true; };
        }
    }, [isFirstAnimationDone, isAppReady, cards]);


    const handleCloseCard = () => {
        setSelectedCard(null)
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-full overflow-hidden flex-1 h-2/3 min-h-[350px] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} touch-none`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={resetToOptimalView}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
                touchAction: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
            }}
        >
            <CardInfoModal
                isOpen={Boolean(selectedCard)}
                onClose={handleCloseCard}
                image={selectedCard?.image || ''}
                label={selectedCard?.label || ''}
                description={selectedCard?.description || ''}
            />
        </div>
    );
}
