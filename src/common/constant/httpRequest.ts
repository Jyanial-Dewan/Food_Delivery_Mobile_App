// httpRequest.ts (ENTERPRISE VERSION)
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
  AxiosError,
} from 'axios';
import {makeEncryption, makeDecryption} from './encryption';
import {withoutEncryptionApi} from '../apis/withoutEncrytApi';

/* ============================================================
  TYPES
============================================================ */
export type httpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export interface RequestParams {
  url: string;
  method?: httpMethod;
  data?: any;

  // Auth / headers
  access_token?: string | null;
  referer?: string;

  // File
  mediaFile?: any;
  fileKey?: string;
  isParamsAndmediaFile?: boolean;

  // Params
  isEncrypted?: boolean;

  // Debug
  isConsole?: boolean;
  isConsoleParams?: boolean;

  // Base
  baseURL?: string;
  isBaseURLAndURLSame?: boolean;
}

type LoadingCallback = (state: boolean) => void;

/* ============================================================
  AXIOS INSTANCE
============================================================ */
const axiosInstance: AxiosInstance = axios.create({
  // baseURL: 'http://10.0.2.2:3000',
  timeout: 20000,
});

/* ============================================================
  HELPERS
============================================================ */

const ensureHeaders = (config: AxiosRequestConfig): AxiosHeaders => {
  if (config.headers instanceof AxiosHeaders) {
    return config.headers;
  }

  const headers = new AxiosHeaders();

  if (config.headers && typeof config.headers === 'object') {
    Object.entries(config.headers).forEach(([key, value]) => {
      if (value !== undefined) {
        headers.set(key, value as any);
      }
    });
  }

  return headers;
};

/* ============================================================
  REQUEST INTERCEPTOR
============================================================ */
axiosInstance.interceptors.request.use(
  async config => {
    const url = config.url ?? '';

    const isSkipEncryption = withoutEncryptionApi.some(api =>
      url.includes(api),
    );

    // ✅ Detect RN FormData FIRST
    const isFormData =
      typeof config.data === 'object' &&
      config.data !== null &&
      (config.data as any)._parts !== undefined;

    // ================= FILE UPLOAD =================
    if (isFormData) {
      const headers = ensureHeaders(config);
      headers.set('Content-Type', 'multipart/form-data');
      config.headers = headers;

      // ❌ skip encryption, BUT NOT multipart setup
      return config;
    }

    // ================= JSON BODY =================
    if (!isSkipEncryption && config.data) {
      const encrypted = await makeEncryption(JSON.stringify(config.data));

      if (encrypted) {
        config.data = encrypted;

        const headers = ensureHeaders(config);
        headers.set('Content-Type', 'application/json');
        config.headers = headers;
      }
    }

    return config;
  },
  error => Promise.reject(error),
);

/* ============================================================
  RESPONSE INTERCEPTOR
============================================================ */
axiosInstance.interceptors.response.use(
  response => {
    const url = response.config.url ?? '';

    if (withoutEncryptionApi.some(api => url.includes(api))) {
      return response;
    }

    if (typeof response.data !== 'string') {
      return response;
    }

    try {
      const decrypted = makeDecryption(response.data);
      return decrypted ? {...response, data: decrypted} : response;
    } catch {
      return response;
    }
  },
  error => Promise.reject(error),
);

/* ============================================================
  MAIN HTTP REQUEST
============================================================ */
export const httpRequest = async (
  params: RequestParams,
  cb?: LoadingCallback,
) => {
  const method = params.method ?? 'GET';

  let config: AxiosRequestConfig = {
    method,
    baseURL: params.isBaseURLAndURLSame
      ? params.url
      : params.baseURL ?? axiosInstance.defaults.baseURL,
    headers: {
      Authorization: params.access_token
        ? `Bearer ${params.access_token}`
        : undefined,
      Referer: params.referer,
    },
  };

  /* ================= FILE UPLOAD ================= */
  if (params.mediaFile) {
    const formData = new FormData();

    formData.append((params.fileKey ?? 'file').trim(), {
      uri: params.mediaFile.uri,
      name: params.mediaFile.fileName || params.mediaFile.name || 'upload.jpg',
      type: params.mediaFile.type || 'image/jpeg',
    } as any);

    // file + params
    if (params.isParamsAndmediaFile && params.data) {
      Object.keys(params.data).forEach(key => {
        formData.append(key, String(params.data[key]));
      });
    }

    config.url = params.url;
    config.data = formData;
  } else if (params.data) {
    /* ================= NORMAL DATA ================= */
    if (method === 'GET') {
      config = await processGetParams(params, config);
    } else {
      config.url = params.url;
      config.data = params.data;
    }
  } else {
    config.url = params.url;
  }

  /* ================= EXECUTE ================= */
  try {
    cb?.(true);

    if (params.isConsoleParams) {
      console.log('🔍 API CONFIG:', config);
    }

    const response: AxiosResponse = await axiosInstance(config);

    cb?.(false);

    if (params.isConsole) {
      console.log('✅ API RESPONSE:', response.data);
    }

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.log(error, 'error');
    cb?.(false);
    const err = error as AxiosError;

    return {
      success: false,
      status: err.response?.status ?? 500,
      data: err.response?.data ?? err.message ?? 'Network Error',
    };
  }
};

/* ============================================================
  GET PARAM HANDLER
============================================================ */
const processGetParams = async (
  params: RequestParams,
  config: AxiosRequestConfig,
) => {
  const query = new URLSearchParams(params.data).toString();

  if (params.isEncrypted) {
    const encrypted = await makeEncryption(query);
    return {...config, url: `${params.url}?${encrypted}`};
  }

  return {...config, url: `${params.url}?${query}`};
};
