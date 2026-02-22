import {api} from './api';
const withoutEncryptionApi = [
  api.AuthAppsLogin,
  api.UserUpdate,
  api.FoodReview,
  api.UsersCreate,
  // api.Users,
  // api.ProfileImage
];

export {withoutEncryptionApi};
