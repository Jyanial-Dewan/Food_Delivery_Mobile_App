import {api} from './api';
const withoutEncryptionApi = [
  api.AuthAppsLogin,
  api.UserUpdate,
  // api.Users,
  // api.ProfileImage
];

export {withoutEncryptionApi};
