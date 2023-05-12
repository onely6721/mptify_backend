import { SubscriptionStatusesEnum } from '../../../models/user/nested/subscription.schema';

export type T_WebhookBody =
  | T_CreatedWebhookBody
  | T_UpdatedWebhookBody
  | T_CanceledWebhookBody
  | T_PaymentSucceededWebhookBody
  | T_PaymentFailedWebhookBody
  | T_PaymentRefundedWebhookBody;

type T_DefaultWebhookBody = {
  alert_id: string;
  checkout_id: string;
  currency: string;
  email: string;
  event_time: string;
  marketing_consent: '0' | '1';
  passthrough: string;
  status: SubscriptionStatusesEnum;
  subscription_id: string;
  subscription_plan_id: string;
  user_id: string;
  p_signature: string;
};
type T_CreatedWebhookBody = T_DefaultWebhookBody & {
  alert_name: 'subscription_created';
  cancel_url: string;
  next_bill_date: string;
  quantity: string;
  source: string;
  unit_price: string;
  update_url: string;
};
type T_UpdatedWebhookBody = T_DefaultWebhookBody & {
  alert_name: 'subscription_updated';
  cancel_url: string;
  new_price: string;
  new_quantity: string;
  new_unit_price: string;
  next_bill_date: string;
  old_price: string;
  old_quantity: string;
  old_unit_price: string;
  update_url: string;
  old_next_bill_date: string;
  old_status: 'active' | 'trialing' | 'past_due' | 'paused' | 'deleted';
  old_subscription_plan_id: string;
  paused_at?: string;
  paused_from?: string;
  paused_reason?: 'delinquent' | 'voluntary';
};
type T_CanceledWebhookBody = T_DefaultWebhookBody & {
  alert_name: 'subscription_cancelled';
  cancellation_effective_date: string;
  quantity: string;
  unit_price: string;
};
type T_PaymentSucceededWebhookBody = T_DefaultWebhookBody & {
  alert_name: 'subscription_payment_succeeded';
  balance_currency: string;
  balance_earnings: string;
  balance_fee: string;
  balance_gross: string;
  balance_tax: string;
  country: string;
  coupon: string;
  customer_name: string;
  earnings: string;
  fee: string;
  initial_payment: '0' | '1';
  instalments: string;
  next_bill_date: string;
  next_payment_amount: string;
  order_id: string;
  payment_method: 'card' | 'paypal';
  payment_tax: string;
  plan_name: string;
  quantity: string;
  receipt_url: string;
  sale_gross: string;
  subscription_payment_id: string;
  unit_price: string;
};
type T_PaymentFailedWebhookBody = T_DefaultWebhookBody & {
  alert_name: 'subscription_payment_failed';
  instalments: string;
  order_id: string;
  quantity: string;
  subscription_payment_id: string;
  unit_price: string;
  amount: string;
  cancel_url: string;
  next_retry_date: string;
  update_url: string;
  attempt_number: string;
};
type T_PaymentRefundedWebhookBody = T_DefaultWebhookBody & {
  alert_name: 'subscription_payment_refunded';
  instalments: string;
  order_id: string;
  quantity: string;
  subscription_payment_id: string;
  unit_price: string;
  amount: string;
  balance_currency: string;
  balance_earnings_decrease: string;
  balance_fee_refund: string;
  balance_gross_refund: string;
  balance_tax_refund: string;
  earnings_decrease: string;
  fee_refund: string;
  gross_refund: string;
  initial_payment: '0' | '1';
  refund_reason: string;
  refund_type: 'full' | 'vat' | 'partial';
  tax_refund: string;
};
export type T_ProductWebhookBody = {
  event_time: string;
  p_country: string;
  p_coupon: string;
  p_coupon_savings: string;
  p_currency: string;
  p_earnings: string;
  p_order_id: string;
  p_paddle_fee: string;
  p_price: string;
  p_product_id: string;
  p_quantity: '1';
  p_sale_gross: string;
  p_tax_amount: string;
  p_used_price_override: string;
  passthrough: string;
  product: 'crush';
  quantity: string;
  p_signature: string;
};
