'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    PropsWithChildren,
} from 'react';
import { useRouter } from 'next/navigation';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

import { DATA_TYPES_EVENTS, sendWebsocketMessages, WebsocketEventPayload } from '@/store/selectors/sendWebsocketMessage';
import { useAppDispatch, useAppSelector } from '@/store';
import { configurationService } from '@/lib/services';

type ContextType = {
    close(): void;
};

const Context = createContext<ContextType>({} as ContextType);

const WebsocketContext = ({ children }: PropsWithChildren) => {
    const dispatch = useAppDispatch();
    const userId = useAppSelector(state => state.user.id)
    const router = useRouter();

    const echoRef = useRef<any>(null);

    const close = () => {
        if (echoRef.current) {
            try {
                echoRef.current.disconnect?.();
            } catch (e) {
                console.warn('Echo disconnect error', e);
            }
            echoRef.current = null;
        }
    };

    const initializeSocket = async () => {
        close();
        if (userId == 0) return;

        const configuration = await configurationService.getConfiguration();
        const config = configuration.data.web_socket;
        const token = localStorage.getItem('authToken')

        const bearerToken = `Bearer ${token}`;

        if (typeof window !== 'undefined') {
            (window as any).Pusher = Pusher;
        }

        const wsPort = Number(config.port) || 6001;

        const options: any = {
            broadcaster: 'reverb',
            key: config.key,
            wsHost: config.host,
            wsPort: wsPort,
            wssPort: wsPort,
            forceTLS: true,
            enabledTransports: ['ws', 'wss'],
            authEndpoint: config.auth,
            auth: {
                headers: {
                    Authorization: bearerToken,
                },
            },
        };

        const echo = new Echo(options);

        const channel = echo.private(`user.${userId}`)

        channel.listenToAll((event: DATA_TYPES_EVENTS, data: any) => {
            sendWebsocketMessages({ type: event, payload: data }, dispatch, router);
        })

        const pusherConnector = echo.connector as any;
        pusherConnector.pusher.connection.bind('connected', () => {
            sendWebsocketMessages({ type: DATA_TYPES_EVENTS.CONNECT }, dispatch, router);
        });

        pusherConnector.pusher.conenction.bind('answer', (data: any) => {
            sendWebsocketMessages({ type: DATA_TYPES_EVENTS.ANSWER, payload: data }, dispatch, router)
        })

        pusherConnector.pusher.connection.bind('pong', () => {
            sendWebsocketMessages({ type: DATA_TYPES_EVENTS.PONG }, dispatch, router);
        });

    }

    useEffect(() => {
        initializeSocket();

        return () => {
            close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    return <Context.Provider value={{ close }}>{children}</Context.Provider>;
};

export const useWebsocketContext = () => useContext(Context);
export default WebsocketContext;
