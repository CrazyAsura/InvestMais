import axios from 'axios';
import { Platform } from 'react-native';

// Importação dinâmica para evitar ciclos de dependência
let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

const BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3000' 
  : 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

export default api;
