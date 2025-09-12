import { Capacitor } from "@capacitor/core";
import { Receipt, Transaction } from "../types/purchase";

export enum CDVPurchaseErrors {
    WRONG_PLATFORM = 'CdvPurchase plugin is not available on your platform!',
    UNHANDLED_ERROR = 'Unhandled Error'
}

export class PurchaseService {
    private static instance: PurchaseService;

    static getInstance(): PurchaseService {
        if (!PurchaseService.instance) {
            PurchaseService.instance = new PurchaseService();
        }
        return PurchaseService.instance;
    }

    private getCdvPurchase(): any {
        if (typeof window === 'undefined') return null;
        return (window as any)?.CdvPurchase || null;
    }

    async initialize(): Promise<void> {
        const CdvPurchase = this.getCdvPurchase();

        if (!CdvPurchase) {
            if (!Capacitor.isNativePlatform()) {
                throw new Error(CDVPurchaseErrors.WRONG_PLATFORM);
            }
            throw new Error(CDVPurchaseErrors.UNHANDLED_ERROR)
        }

        const { store, Platform, LogLevel } = CdvPurchase;

        store.verbosity = LogLevel.INFO;

        await store.initialize([
            Platform.APPLE_APPSTORE,
            Platform.GOOGLE_PLAY
        ]);

        await this.setupListeners();
    }

    async registerProducts(productIds: string[]): Promise<void> {
        const CdvPurchase = this.getCdvPurchase();
        if (!CdvPurchase) return;
        const { store, ProductType, Platform } = CdvPurchase;

        const ids = Array.from(new Set(productIds.filter(Boolean)));
        if (!ids.length) return;

        store.register([
            ...ids.map((id: string) => ({ id, type: ProductType.PAID_SUBSCRIPTION, platform: Platform.APPLE_APPSTORE })),
            ...ids.map((id: string) => ({ id, type: ProductType.PAID_SUBSCRIPTION, platform: Platform.GOOGLE_PLAY })),
        ]);

        await store.update();
    }

    private async setupListeners(): Promise<void> {
        const CdvPurchase = this.getCdvPurchase();
        if (!CdvPurchase) return;
        const { store } = CdvPurchase;

        store.when()
            .approved((transaction: Transaction) => {
                transaction.verify();
            })
            .verified((receipt: Receipt) => {
                receipt.finish();
            })
            .finished((transaction: Transaction) => {
            });
    }

    async getProducts(productIds: string[]): Promise<any[]> {
        const CdvPurchase = this.getCdvPurchase();
        if (!CdvPurchase) return [];
        const { store } = CdvPurchase;

        store.register(productIds.map((id: string) => ({
            id,
            type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
            platform: CdvPurchase.Platform.APPLE_APPSTORE
        })));

        await store.update();
        return store.products;
    }

    async purchaseProduct(productId: string): Promise<boolean> {
        const CdvPurchase = this.getCdvPurchase();
        if (!CdvPurchase) return false;
        const { store } = CdvPurchase;
        const product = store.get(productId);

        if (!product) {
            return false;
        }

        if (product.canPurchase) {
            await product.getOffer().order();
            return true;
        }

        return false;
    }

    async restorePurchases(): Promise<void> {
        const CdvPurchase = this.getCdvPurchase();
        if (!CdvPurchase) return;
        const { store } = CdvPurchase;
        await store.restorePurchases();
    }
}