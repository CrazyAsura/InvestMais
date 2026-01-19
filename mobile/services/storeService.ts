import api from './api';
import { Product, Category } from '../types/store';

export const StoreService = {
  getProducts: async (categoryId?: string) => {
    const params = categoryId ? { category: categoryId } : {};
    const response = await api.get<Product[]>('/store/product', { params });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get<Category[]>('/store/category');
    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await api.get<Product>(`/store/product/${id}`);
    return response.data;
  },

  createProduct: async (data: Partial<Product>) => {
    const response = await api.post<Product>('/store/product', data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<Product>) => {
    const response = await api.patch<Product>(`/store/product/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    await api.delete(`/store/product/${id}`);
  },

  createCategory: async (data: Partial<Category>) => {
    const response = await api.post<Category>('/store/category', data);
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<Category>) => {
    const response = await api.patch<Category>(`/store/category/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    await api.delete(`/store/category/${id}`);
  },

  getOrders: async () => {
    const response = await api.get('/order');
    return response.data;
  },
};
