import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { AppDispatch, astroActions, tarotActions, userActions } from '@/store';
import { astroApiService } from '@/lib/services/astro-api';

export enum DATA_TYPES_EVENTS {
    CONNECT = 'connect',
    PONG = 'pong',
    ANSWER = '.answer',
    UPGRADE_PLAN = 'upgrade-plan'
}

export type WebsocketEventPayload = {
    type: DATA_TYPES_EVENTS;
    message?: string;
    payload?: unknown;
};

export type SenderType = 'tarot' | 'natal_chart' | 'fate_matrix'

export type Answer = {
    url_message: string,
    sender_id: number,
    sender_type: SenderType
}

export const sendWebsocketMessages = (
    data: WebsocketEventPayload,
    dispatch: AppDispatch,
    router: AppRouterInstance
) => {

    switch (data.type) {
        case DATA_TYPES_EVENTS.CONNECT:
            break;

        case DATA_TYPES_EVENTS.ANSWER:
            const payload = data.payload as Answer;

            if (payload.sender_type == 'tarot') {
                dispatch(tarotActions.getTarotAnswerFromChat(payload.url_message))
                return;
            }

            if (payload.sender_type == 'fate_matrix' || payload.sender_type == 'natal_chart') {
                dispatch(astroActions.getAnswerFromChat(payload.url_message))
                return;
            }

        case DATA_TYPES_EVENTS.UPGRADE_PLAN:
            try {
                const payload = data.payload as { old_plan_id?: number | string, new_plan_id?: number | string };
                const oldId = Number(payload?.old_plan_id ?? NaN);
                const newId = Number(payload?.new_plan_id ?? NaN);
                if (!Number.isNaN(oldId) && !Number.isNaN(newId) && oldId !== newId) {
                    dispatch(astroActions.getPlans());
                }
            } catch {}
            break;

        case DATA_TYPES_EVENTS.PONG:
            break;

        default:
            console.log('Unhandled WS event:', data.type, data.payload);
            break;
    }
};

export default sendWebsocketMessages;
