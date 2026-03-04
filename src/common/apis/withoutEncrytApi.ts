import {api} from './api';
const withoutEncryptionApi = [
  api.AuthAppsLogin,
  api.UserUpdate,
  api.FoodReview,
  api.UsersCreate,
  api.Users,
  api.Orders,
  api.OrderItems,
  api.CartItems,
  // api.ProfileImage
];

export {withoutEncryptionApi};
