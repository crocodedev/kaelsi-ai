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

    async initialize(userId:number, productIds: string[]): Promise<void> {
        const CdvPurchase = this.getCdvPurchase();

        if (!CdvPurchase) {
            if (!Capacitor.isNativePlatform()) {
                throw new Error(CDVPurchaseErrors.WRONG_PLATFORM);
            }
            throw new Error(CDVPurchaseErrors.UNHANDLED_ERROR)
        }

        const { store, Platform, LogLevel } = CdvPurchase;

        store.verbosity = LogLevel.INFO;

        await this.registerProducts(userId,productIds);

        await this.setupListeners();

        await store.initialize([
            {
              platform: Platform.GOOGLE_PLAY,
              options: {
                needAppReceipt: true,
              },
            },
            {
              platform: Platform.APPLE_APPSTORE,
              options: {
                needAppReceipt: true,
              },
            },
          ]);
        
          await store.update();
    }

    async registerProducts(userId: number, productIds: string[]): Promise<void> {
        const CdvPurchase = this.getCdvPurchase();
        if (!CdvPurchase) return;
        const { store, ProductType, Platform } = CdvPurchase;

        const ids = Array.from(new Set(productIds.filter(Boolean)));
        if (!ids.length) return;
        
        if (!userId || userId === 0) {
            console.warn('Invalid userId provided to registerProducts:', userId);
            throw new Error('Invalid userId: userId must be a positive number');
        }
        
        store.validator = `https://validator.iaptic.com/v1/webhook/google?appName=io.kaelsi.app&apiKey=ede5c295-d8e1-4eba-9fc8-4411f9d99e02`;
        store.applicationUsername = userId;
        store.register([
            ...ids.map((id: string) => ({
              id,
              type: ProductType.PAID_SUBSCRIPTION,
              platform: Platform.GOOGLE_PLAY,
            })),
            ...ids.map((id: string) => ({
              id,
              type: ProductType.PAID_SUBSCRIPTION,
              platform: Platform.APPLE_APPSTORE,
            })),
          ]);

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
        await store.update();

        const products = Array.isArray(store.products) ? store.products : [];
        return products;
    }

    async getProductPricing(productId: string): Promise<{ amountMicros: number | null; currency: string | null; formatted: string | null; priceNumber: number | null; }> {
        const CdvPurchase = this.getCdvPurchase();
        if (!CdvPurchase) return { amountMicros: null, currency: null, formatted: null, priceNumber: null };
        const { store } = CdvPurchase;
        await store.update();
        const product = store.get(productId);
        if (!product) return { amountMicros: null, currency: null, formatted: null, priceNumber: null };
        const offer = typeof product.getOffer === 'function' ? product.getOffer() : (product?.offers?.[0] ?? null);
        const pricing = offer?.pricing ?? product?.pricing ?? null;
        const amountMicros = pricing?.priceMicros ?? pricing?.price_amount_micros ?? null;
        const currency = pricing?.currency ?? pricing?.price_currency_code ?? null;
        const formatted = pricing?.price ?? null;
        const priceNumber = typeof pricing?.price === 'number' ? pricing.price : (amountMicros != null ? amountMicros / 1_000_000 : null);
        return { amountMicros, currency, formatted, priceNumber };
    }

    async purchaseProduct(productId: string): Promise<boolean> {
        const CdvPurchase = this.getCdvPurchase();
        if (!CdvPurchase) return false;
        const { store } = CdvPurchase;
        console.log('store', store);
        console.log('productId', productId);
        let product = store.get(productId);
        console.log('product 1', product);

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