export type ILogInPayloadType = {
  user: string;
  password: string;
};

export type ISignUpPayloadType = {
  username: string;
  user_type: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  password: string;
};
export type IForgotPasswordPayloadType = {
  email: string;
};

export interface IUser {
  user_id: number;
  username: string;
  user_type: string;
  email: string;
  phone: string[];
  first_name?: string;
  last_name?: string;
  created_at: Date;
  latitude?: number;
  longitude?: number;
  connection_time?: Date;
  profile_image_original?: string;
  profile_image_thumbnail?: string;
}

export interface IFoodItem {
  food_id: number;
  user_id: number;
  name: string;
  description?: string;
  price: number;
  discount_price?: number;
  category: string;
  is_veg: boolean;
  is_available: boolean;
  calories?: number;
  created_at: Date;
  updated_at: Date;
  image_urls: string[];
  avg_rating: number;
  review_count: number;
}
