'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Spine } from '@pixi/spine-pixi';


import { Application } from 'pixi.js';
import { usePreloadingContext } from '@/contexts/animation';
import { ANIMATION_ALIASES } from '@/contexts/animation/helpers';
import { tarotActions, useAppDispatch, useAppSelector } from '@/store';
import { Loader } from "@/components/ui/loader";

export function ChartShuffle() {
    const appRef = useRef<Application | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const shuffleRef = useRef<Spine | null>(null);
    const isFirstAnimationDone = useAppSelector(state => state.tarot.isFirstAnimationDone);
    const { atlasArray, skeletonArray, textureArray, isPreloadingFinish } = usePreloadingContext();

    const setup = useCallback(async () => {
        if (wrapperRef.current && typeof window !== 'undefined') {
            try {
                appRef.current = new Application();
                await appRef.current.init({
                    resizeTo: wrapperRef.current,
                    backgroundAlpha: 0,
                    roundPixels: true,
                    resolution: window.devicePixelRatio || 1,
                    autoDensity: true,
                });

                if (wrapperRef.current && appRef.current.canvas) {
                    wrapperRef.current.appendChild(appRef.current.canvas);
                }
            } catch (error) {
                console.error('Error initializing PIXI.js app:', error);
            }
        }
    }, []);

    const loadShuffle = useCallback(async () => {

        if (!skeletonArray || !atlasArray || skeletonArray.length === 0 || atlasArray.length === 0) {
            console.warn('skeletonArray or atlasArray is null, empty, or undefined');
            return;
        }

        const app = appRef.current;
        if (!app) {
            console.error('PIXI.js app not initialized');
            return;
        }

        const skeletonItem = skeletonArray.find(item => item.alias.includes(`${ANIMATION_ALIASES.SHUFFLE}`));
        const atlasItem = atlasArray.find(item => item.alias.includes(`${ANIMATION_ALIASES.SHUFFLE}_atlas`));

        if (!skeletonItem || !atlasItem) {
            console.warn(`No skeleton or atlas found for: ${ANIMATION_ALIASES.SHUFFLE}`);
            return;
        }

        const skeletonAlias = skeletonItem.alias;
        const atlasAlias = atlasItem.alias;

        if (!skeletonAlias || !atlasAlias) {
            console.warn('skeletonAlias or atlasAlias is null or undefined');
            return;
        }

        try {

            const spine = Spine.from({
                skeleton: skeletonAlias,
                atlas: atlasAlias,
                scale: 1,
            });

            shuffleRef.current = spine;

            if (shuffleRef.current && shuffleRef.current.skeleton) {
                if (app) {
                    shuffleRef.current.x = app.screen.width / 2;
                    shuffleRef.current.y = app.screen.height / 2;
                }

                shuffleRef.current.skeleton.setSlotsToSetupPose();
                shuffleRef.current.visible = true;
                shuffleRef.current.scale.set(1);

                if (app?.stage) {
                    app.stage.addChild(shuffleRef.current);

                    if (shuffleRef.current.state) {
                        shuffleRef.current.state.setAnimation(0, 'animation3', false);

                        const animationDuration = 3000;

                        setTimeout(() => {
                            dispatch(tarotActions.setIsFirstAnimationDone(true));
                        }, animationDuration);

                    } else {
                        console.warn('Spine state not available');
                    }
                }
            } else {
                console.warn('Spine skeleton not available');
            }
        } catch (error) {
            console.error('Error creating spine animation:', error);
        }
    }, [skeletonArray, atlasArray, textureArray, dispatch]);

    const init = useCallback(async () => {
        if (!appRef.current) {
            await setup();
        }

        if (shuffleRef.current) {
            if (appRef.current?.stage) {
                appRef.current.stage.removeChild(shuffleRef.current);
            }
            shuffleRef.current.destroy();
            shuffleRef.current = null;
        }

        await loadShuffle();
    }, [setup, loadShuffle]);

    useEffect(() => {
        if (isPreloadingFinish) {
            init();
        }

        return () => {
            if (shuffleRef.current) {
                try {
                    if (appRef.current?.stage) {
                        appRef.current.stage.removeChild(shuffleRef.current);
                    }
                    shuffleRef.current.destroy({ children: true });
                    shuffleRef.current = null;
                } catch (e) {
                    console.error(e);
                }
            }
            if (appRef.current) {
                try {
                    appRef.current.destroy(true, { children: true });
                    appRef.current = null;
                } catch (e) {
                    console.error(e);
                }
            }
        };
    }, [init, isPreloadingFinish]);

    if (!isPreloadingFinish || !skeletonArray || !atlasArray) {
        return <Loader />;
    }

    return <div ref={wrapperRef}></div>;
};

