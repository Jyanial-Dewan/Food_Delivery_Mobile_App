import {UserState} from '../../stores/Redux/Slices/UserSlice';

export const toTitleCase = (str: string | undefined) => {
  if (str) {
    return str
      .toLowerCase() // first make everything lowercase
      .replace(/\b\w/g, char => char.toUpperCase()); // capitalize first letter of each word
  }
};

export const renderUserName = (id: number, users: UserState[]) => {
  const user = users.find(usr => usr.user_id === id);

  return user?.username;
};
