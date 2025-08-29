import { createAction } from '@reduxjs/toolkit';


export const purchaseActions = {
  getSubscriptions: createAction<void>('purchase/getSubscriptions'),
  getProducts: createAction<void>('purchase/getProducts'),
  purchaseProduct: createAction<string>('purchase/purchaseProduct'),
  restorePurchases: createAction<void>('purchase/restorePurchases'),
};

export default purchaseActions; 