import { debounce } from '@/lib/utils';
import { astroApiService } from './astro-api';

export interface AnalyticsEvent {
    type: string;
    data: string[] | null;
}

class AnalyticsService {
    private events: AnalyticsEvent[] = [];
    private isProcessing = false;
    private batchSize = 10;
    private flushInterval = 5000;
    private isUserActive = false;
    private userActivityTimeout: NodeJS.Timeout | null = null;

    constructor() {
        this.startPeriodicFlush();
        this.setupUserActivityTracking();
    }

    track(type: string, data: string[] | null = null) {
        if (!this.isUserActive) {
            return;
        }

        if (type === 'page_view' && (data?.[0] === '/' || data?.[0] === '/loading')) {
            return;
        }

        this.events.push({ type, data });

        if (this.events.length >= this.batchSize) {
            this.flush();
        }
    }

    private async flush() {
        if (this.isProcessing || this.events.length === 0) return;

        this.isProcessing = true;
        const eventsToSend = [...this.events];
        this.events = [];


        try {
            astroApiService.sendEvent(eventsToSend)
        } catch (error) {
            this.events.unshift(...eventsToSend);
        } finally {
            this.isProcessing = false;
        }
    }

    private startPeriodicFlush() {
        setInterval(() => {
            this.flush();
        }, this.flushInterval);
    }

    private setupUserActivityTracking() {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        const markUserActive = () => {
            this.isUserActive = true;

            if (this.userActivityTimeout) {
                clearTimeout(this.userActivityTimeout);
            }

            this.userActivityTimeout = setTimeout(() => {
                this.isUserActive = false;
            }, 30000);
        };

        if (typeof document === 'undefined') return;

        events.forEach(event => {
            document.addEventListener(event, markUserActive, { passive: true });
        });
    }

    trackClick = debounce((element: Element) => {
        const path = this.getElementPath(element);
        const dataId = element.getAttribute('data-id');
        this.track('click', [path, dataId || '']);
    }, 100);

    trackScroll = debounce((x: number, y: number) => {
        this.track('scroll', [`x:${x}`, `y:${y}`]);
    }, 300);

    trackZoom = debounce((scale: number) => {
        this.track('zoom', [`scale:${scale}`]);
    }, 500);

    trackPageView(path: string) {
        this.track('page_view', [path]);
    }

    forceTrack(type: string, data: string[] | null = null) {
        this.events.push({ type, data });

        if (this.events.length >= this.batchSize) {
            this.flush();
        }
    }

    trackFormSubmit(formId: string) {
        this.track('form_submit', [formId]);
    }

    trackButtonClick(buttonText: string, buttonId?: string) {
        const data = buttonId ? [buttonText, buttonId] : [buttonText];
        this.track('button_click', data);
    }

    private getElementPath(element: Element): string {
        const path: string[] = [];
        let current = element;

        while (current && current !== document.body) {
            let selector = current.tagName.toLowerCase();

            if (current.id) {
                selector += `#${current.id}`;
            } else if (current.className) {
                const classes = Array.from(current.classList).join('.');
                selector += `.${classes}`;
            }

            if (current === element) {
                const index = Array.from(current.parentElement?.children || []).indexOf(current);
                if (index > 0) selector += `:nth-child(${index + 1})`;
            }

            path.unshift(selector);
            current = current.parentElement!;
        }

        return path.join(' > ');
    }
}

export const analyticsService = new AnalyticsService(); 