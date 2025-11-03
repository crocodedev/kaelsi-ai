import { useState, useEffect, useCallback } from 'react';
import { PurchaseService } from '@/lib/services/purchase';
import { Product } from '@/lib/types/purchase';
import { useAppSelector } from '@/store';
import { OrderAdditional } from '@/components/subcription/types';

export const usePurchase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const plans = useAppSelector(state => state.astro.plans)
  const applicationUsername = useAppSelector(state => state.user.applicationUsername)

  useEffect(() => {
    const register = async () => {
      try {
        if (!applicationUsername) {
          console.log('Waiting for userId to be available...');
          return;
        }

        if (!Array.isArray(plans) || plans.length === 0) return;
        const productIds: string[] = [];
        (plans as any[]).forEach((p: any) => {
          if (!p || typeof p !== 'object') return;
          const id = p.google_pay_id || null;
          if (id) productIds.push(String(id));
        });
        if (productIds.length === 0) return;

        await PurchaseService.getInstance().initialize(applicationUsername, productIds);
        setIsInitialized(true);
      } catch (e) {
        console.warn('registerProducts failed', e);
      }
    };

    register();
  }, [plans, applicationUsername]);

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

  const purchaseProduct = useCallback(async (productId: string, orderAdditional: OrderAdditional) => {
    try {
      const result = await PurchaseService.getInstance().purchaseProduct(productId, orderAdditional);
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