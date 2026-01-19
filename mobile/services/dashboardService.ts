import api from './api';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  chartData: {
    label: string;
    users: number;
    actions: number;
  }[];
}

export const DashboardService = {
  getStats: async () => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },
};
