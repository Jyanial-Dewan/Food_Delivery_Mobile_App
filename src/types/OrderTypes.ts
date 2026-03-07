export interface IOrderStatus {
  code: string;
  color: string;
  label: string;
  position: number;
  available_for: string;
}

export interface IOrderItem {
  order_item_id: number;
  food_id: number;
  food_name: string;
  quantity: number;
  subtotal: number;
  created_at: Date;
}

export interface IOrder {
  order_id: number;
  customer_id: number;
  vendor_id: number;
  delivery_man_id?: number;
  status_code: string;
  payment_status: string;
  payment_method: string;
  delivery_address?: string;
  notes?: string;
  total_amount: number;
  total_items: number;
  order_items: IOrderItem[];
  created_at: Date;
  updated_at: Date;
}
