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
