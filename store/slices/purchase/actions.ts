import { createAction } from '@reduxjs/toolkit';


export const purchaseActions = {
  getSubscriptions: createAction<void>('purchase/getSubscriptions'),
};

export default purchaseActions; 