import { useState, useEffect, useCallback } from 'react';
import { PurchaseService } from '@/lib/services/purchase';
import { Product } from '@/lib/types/purchase';
import { useAppSelector } from '@/store';

export const usePurchase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const plans = useAppSelector(state=>state.astro.plans)

  useEffect(() => {
    const initPurchase = async () => {
      try {
        await PurchaseService.getInstance().initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Purchase initialization failed:', error);
      }
    };

    initPurchase();
  }, []);

  useEffect(() => {
    const register = async () => {
      try {
        if (!isInitialized) return;
        if (!Array.isArray(plans) || plans.length === 0) return;
        const prefix = process.env.NEXT_PUBLIC_IAP_PREFIX || 'com.app';
        const productIds: string[] = [];
        (plans as any[]).forEach((p: any) => {
          if (!p || typeof p !== 'object') return;
          const id = p.productId || p.sku || (p.id !== undefined && p.id !== null ? `${prefix}.plan.${p.id}` : null);
          if (id) productIds.push(String(id));
        });
        if (productIds.length === 0) return;
        await PurchaseService.getInstance().registerProducts(productIds);
      } catch (e) {
        console.warn('registerProducts failed', e);
      }
    };

    register();
  }, [plans, isInitialized]);

  const getProducts = useCallback(async (productIds: string[]) => {
    try {
      const products = await PurchaseService.getInstance().getProducts(productIds);
      setProducts(products);
      return products;
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }
  }, []);

  const purchaseProduct = useCallback(async (productId: string) => {
    try {
      const result = await PurchaseService.getInstance().purchaseProduct(productId);
      return result; 
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }, []);

  const restorePurchases = useCallback(async () => {
    try {
      await PurchaseService.getInstance().restorePurchases();
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  }, []);

  return {
    products,
    isInitialized,
    getProducts,
    purchaseProduct,
    restorePurchases
  };
};