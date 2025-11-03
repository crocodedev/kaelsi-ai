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

    async initialize(applicationUsername: string, productIds: string[]): Promise<void> {
        const CdvPurchase = this.getCdvPurchase();

        if (!CdvPurchase) {
            if (!Capacitor.isNativePlatform()) {
                throw new Error(CDVPurchaseErrors.WRONG_PLATFORM);
            }
            throw new Error(CDVPurchaseErrors.UNHANDLED_ERROR)
        }

        const { store, Platform, LogLevel } = CdvPurchase;

        store.verbosity = LogLevel.INFO;

        await this.registerProducts(applicationUsername, productIds);

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

    async registerProducts(applicationUsername: string, productIds: string[]): Promise<void> {
        const CdvPurchase = this.getCdvPurchase();
        if (!CdvPurchase) return;

        const { store, ProductType, Platform } = CdvPurchase;

        const baseIds = Array.from(
            new Set(
                productIds
                    .filter(Boolean)
                    .map((id) => id.split(':')[0]) 
            )
        );

        if (!baseIds.length) return;

        if (!applicationUsername) {
            console.warn('Invalid userId provided to registerProducts:', applicationUsername);
            throw new Error('Invalid userId: userId must be a positive number');
        }

        store.validator = `https://validator.iaptic.com/v1/webhook/google?appName=io.kaelsi.app&apiKey=ede5c295-d8e1-4eba-9fc8-4411f9d99e02`;
        store.applicationUsername = applicationUsername;

        const mappedProducts = baseIds.flatMap((id) => [
            {
                id,
                type: ProductType.PAID_SUBSCRIPTION,
                platform: Platform.GOOGLE_PLAY,
            },
            {
                id,
                type: ProductType.PAID_SUBSCRIPTION,
                platform: Platform.APPLE_APPSTORE,
            },
        ]);

        store.register(mappedProducts);
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

    async purchaseProduct(productId: string, order_additional?: { googlePlay?: any }): Promise<boolean> {
        const CdvPurchase = this.getCdvPurchase();
        if (!CdvPurchase) return false;

        const { store } = CdvPurchase;
    
        const [id, offerId] = productId.split(':');
        
        const product = store.get(id);
        if (!product) {
            console.warn(`❌ Product not found: ${id}`);
            return false;
        }
    
        let offer: any = null;
        if (offerId) {
            offer = product.offers?.find((o: any) => o.id === offerId);
            if (!offer) {
                console.warn(`⚠️ Offer '${offerId}' not found for product '${id}'`);
            }
        }
    
        if (!offer) {
            offer = typeof product.getOffer === 'function' ? product.getOffer() : product.offers?.[0];
        }
    
        if (!offer) {
            console.warn(`❌ No available offers for product '${id}'`);
            return false;
        }
    
        if (product.canPurchase) {
            if (order_additional?.googlePlay) {
                await offer.order({ googlePlay: order_additional.googlePlay });
            } else {
                await offer.order(); 
            }
            console.log(`✅ Purchase started: ${id}:${offer.id}`);
            return true;
        }
    
        console.warn(`⚠️ Product '${id}' cannot be purchased right now`);
        return false;
    }
    

    async restorePurchases(): Promise<void> {
        const CdvPurchase = this.getCdvPurchase();
        if (!CdvPurchase) return;
        const { store } = CdvPurchase;
        await store.restorePurchases();
    }
}