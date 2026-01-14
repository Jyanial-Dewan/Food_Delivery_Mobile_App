import {MMKV} from 'react-native-mmkv';
import {secureStorageKey} from '@env';

export const mmkv = new MMKV({
  id: 'mmkv.default',
  encryptionKey: secureStorageKey,
});
mmkv.recrypt(secureStorageKey);

const setItem = (key: string, value: any) =>
  mmkv.set(key, JSON.stringify(value));

const getItem = (key: string) => {
  const value = mmkv.getString(key);
  if (value) {
    return JSON.parse(value);
  }
  return null;
};
const removeItem = (key: string) => mmkv.delete(key);
const clearAll = () => mmkv.clearAll();

export const secureStorage = {
  setItem,
  getItem,
  removeItem,
  clearAll,
};
