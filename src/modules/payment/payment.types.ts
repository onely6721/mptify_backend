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

export type T_PayLink = {
  url: string;
};

export type T_PaddleResponse<R> =
  | T_FailedPaddleResponse
  | T_SuccessPaddleResponse<R>;

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
