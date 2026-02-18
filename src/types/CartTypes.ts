export interface ICartItem {
  user_id: number;
  food_id: number;
  quantity: number;
  name: string;
  discount_price: number;
  added_at?: Date;
  image_url: string[];
}
