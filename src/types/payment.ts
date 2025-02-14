export interface PaymentReadyRequest {
  reservation_id: string;
  user_id: string;
  payment_method: string;
  amount: number;
  status: 'pending';
}

export interface PaymentReadyResponse {
  tid: string;
  next_redirect_pc_url: string;
  next_redirect_mobile_url: string;
  created_at: string;
  payment_id: string;
}

export interface PaymentApproveRequest {
  tid: string;
  pg_token: string;
  order_id: string;
}

export interface PaymentInfo {
  reservation_id: string;
  user_id: string;
  payment_method: string;
  amount: number;
  status: string;
  id: string;
  tid: string;
  transaction_id: string;
  payment_type: string;
  approved_at: string;
  cancel_reason?: string;
  cancel_amount?: number;
  created_at: string;
  updated_at: string;
}
