export enum SubscriptionStatusesEnum {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  PAUSED = 'paused',
  DELETED = 'deleted',
}

export type T_PaddleResponse<R> =
  | T_SuccessPaddleResponse<R>
  | T_FailedPaddleResponse;
type T_SuccessPaddleResponse<R> = {
  success: true;
  response: R;
};
type T_FailedPaddleResponse = {
  success: false;
  error: {
    code: number;
    message: string;
  };
};

export type T_ListPlansItem = {
  id: number;
  name: string;
  billing_type: string;
  billing_period: number;
  initial_price: Record<string, any>;
  recurring_price: Record<string, any>;
  trial_days: number;
};
export type T_PayLinkParams = {
  product_id?: string;
  passthrough: string;
  customer_email: string;
  custom_message?: string;
  customer_country?: string;
  title?: string;
  webhook_url?: string;
  prices?: string[];
  recurring_prices?: string[];
  trial_days?: number;
  coupon_code?: string;
  discountable?: number;
  image_url?: string;
  [key: string]: any;
};

export type T_UpdateSubscriptionParams = {
  subscription_id: string;
  quantity?: number;
  currency?: string;
  recurring_price?: string;
  plan_id?: string;
  prorate?: boolean;
  bill_immediately?: boolean;
  keep_modifiers?: boolean;
  passthrough?: string;
  pause?: boolean;
  [key: string]: any;
};
export type T_UpdateSubscriptionResponse = {
  subscription_id: string;
  user_id: string;
  plan_id: string;
  next_payment: {
    amount: number;
    currency: string;
    date: string;
  };
  [key: string]: any;
};
export type T_PayLink = {
  url: string;
};
export type T_OneOffChargeParams = {
  amount: number;
  charge_name: string;
};
export type T_OneOffChargeResponse = {
  invoice_id: number;
  subscription_id: string;
  amount: number;
  currency: string;
  payment_date: string;
  receipt_url: string;
  order_id: string;
  status: 'success' | 'pending';
};
export type T_ListSubscribersParams = {
  subscription_id?: string;
  plan_id?: string;
  state?: SubscriptionStatusesEnum;
  page?: string;
  results_per_page?: string;
};
export enum TransactionEntityEnum {
  user = 'user',
  subscription = 'subscription',
  order = 'order',
  checkout = 'checkout',
  product = 'product',
}
export type T_ListTransactionsParams = {
  page: number;
};
export type T_ListSubscribersResponse = {
  subscription_id: number;
  plan_id: number;
  user_id: number;
  user_email: string;
  marketing_consent: boolean;
  state: SubscriptionStatusesEnum;
  signup_date: string;
  last_payment: {
    amount: number;
    currency: string;
    date: string;
  };
  next_payment?: {
    amount: number;
    currency: string;
    date: string;
  };
  update_url: string;
  cancel_url: string;
  paused_at?: string;
  paused_from?: string;
  payment_information: Record<string, any>;
};
