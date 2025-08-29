import { useState, useEffect, useCallback } from 'react';
import { PurchaseService } from '@/lib/services/purchase';
import { Product } from '@/lib/types/purchase';

export const usePurchase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

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
      await PurchaseService.getInstance().purchaseProduct(productId);
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