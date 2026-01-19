import axios from 'axios';
import { API_URL } from '../config/api';

// Importação dinâmica para evitar ciclos de dependência
let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(async (config) => {
  const state = store?.getState();
  const token = state?.auth?.token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Interceptor para tratar erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Opcional: Redirecionar para login ou limpar o estado de auth
      console.warn('Sessão expirada ou não autorizada. Verifique o login.');
    }
    return Promise.reject(error);
  }
);

export default api;
