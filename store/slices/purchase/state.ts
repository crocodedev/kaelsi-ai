import { SubscriptionPlan } from '../user/state';

export type InitialStateType = Readonly<{
  subscriptions: SubscriptionPlan[] | null;
  isLoading: boolean;
  error: string | null;
}>;

export const initialState: InitialStateType = {
  subscriptions: null,
  isLoading: true,
  error: null,
};
