import { Receipt, Transaction } from "../types/purchase";

declare global {
    const CdvPurchase: any;
}

export class PurchaseService {
    private static instance: PurchaseService;

    static getInstance(): PurchaseService {
        if (!PurchaseService.instance) {
            PurchaseService.instance = new PurchaseService();
        }
        return PurchaseService.instance;
    }

    async initialize(): Promise<void> {
        if (typeof CdvPurchase === 'undefined') {
            throw new Error('CdvPurchase plugin not available');
        }

        const { store, Platform, LogLevel } = CdvPurchase;

        store.verbosity = LogLevel.INFO;

        await store.initialize([
            Platform.APPLE_APPSTORE,
            Platform.GOOGLE_PLAY
        ]);

        await this.setupListeners();
    }

    private async setupListeners(): Promise<void> {
        const { store } = CdvPurchase;

        store.when()
            .approved((transaction:Transaction) => {
                transaction.verify();
            })
            .verified((receipt:Receipt) => {
                receipt.finish();
            })
            .finished((transaction:Transaction) => {
            });
    }

    async getProducts(productIds: string[]): Promise<any[]> {
        const { store } = CdvPurchase;

        store.register(productIds.map(id => ({
            id,
            type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
            platform: CdvPurchase.Platform.APPLE_APPSTORE
        })));

        await store.update();
        return store.products;
    }

    async purchaseProduct(productId: string): Promise<void> {
        const { store } = CdvPurchase;
        const product = store.get(productId);

        if (product && product.canPurchase) {
            await product.getOffer().order();
        }
    }

    async restorePurchases(): Promise<void> {
        const { store } = CdvPurchase;
        await store.restorePurchases();
    }
}