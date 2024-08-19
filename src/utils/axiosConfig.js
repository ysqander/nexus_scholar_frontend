
// src/api/axiosConfig.js

import axios from 'axios';

const DEFAULT_RETRIES = 2; // Set your desired default retry count here

const axiosWithRetry = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 10 seconds
});

axiosWithRetry.interceptors.request.use(
  config => {
    // Set the default retry count if not already set
    config.retry = config.retry ?? DEFAULT_RETRIES;
    config.retryDelay = config.retryDelay ?? 200; // 200ms delay between retries
    return config;
  },
  error => Promise.reject(error)
);

axiosWithRetry.interceptors.response.use(
  response => response,
  async error => {
    const { config } = error;
    if (!config || !config.retry) {
      return Promise.reject(error);
    }

    config.retry -= 1;

    if (config.retry === 0) {
      return Promise.reject(error);
    }

    await new Promise(resolve => setTimeout(resolve, config.retryDelay));

    return axiosWithRetry(config);
  }
);

// Add a request interceptor to add the auth token
axiosWithRetry.interceptors.request.use(
  async config => {
    return config;
  },
  error => Promise.reject(error)
);

export default axiosWithRetry;