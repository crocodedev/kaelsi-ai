import { Application } from 'pixi.js';

export class PixiAppManager {
    private static instance: PixiAppManager;
    private appInstances = new Map<string, Application>();
    private containerRefs = new Map<string, HTMLDivElement>();

    static getInstance(): PixiAppManager {
        if (!PixiAppManager.instance) {
            PixiAppManager.instance = new PixiAppManager();
        }
        return PixiAppManager.instance;
    }

    hasApp(containerId: string): boolean {
        return this.appInstances.has(containerId);
    }

    getApp(containerId: string): Application | undefined {
        return this.appInstances.get(containerId);
    }

    setApp(containerId: string, app: Application, containerRef: HTMLDivElement): void {
        if (this.appInstances.has(containerId)) {
            this.removeApp(containerId);
        }
        
        this.appInstances.set(containerId, app);
        this.containerRefs.set(containerId, containerRef);
    }

    removeApp(containerId: string): void {
        const app = this.appInstances.get(containerId);
        if (app) {
            try {
                app.destroy(true);
            } catch (e) {
                console.error('Error destroying PIXI app:', e);
            }
            this.appInstances.delete(containerId);
            this.containerRefs.delete(containerId);
        }
    }

    getActiveAppsCount(): number {
        return this.appInstances.size;
    }

    cleanup(): void {
        this.appInstances.forEach((app, id) => {
            this.removeApp(id);
        });
    }
} 