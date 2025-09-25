export interface Purchase {
  id: number;
  user_id: number;
  sweet_id: number;
  quantity: number;
  total_price: number;
  purchase_date: string;
  order_id: string;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: null;
  status: string;
  attempts: number;
  notes: any[];
  created_at: number;
}