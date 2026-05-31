import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {

      return Promise.reject({
        message: error.response.data.message || 'Произошла непредвиденная ошибка',
        errors: error.response.data.errors,
        statusCode: error.response.data.statusCode,
      });
    }

    return Promise.reject({
      message: error.message || 'Ошибка сети. Не удалось связаться с сервером',
      statusCode: 500,
    });
  }
);
