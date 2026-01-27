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
