import axios from 'axios';
import { Customer, DashboardKPIs, TopCity, TopCategory, LoyalCustomer, SegmentProfile, AIInsight, MarketingSuggestion } from '../types';

const API = axios.create({
  baseURL: '/api',
  timeout: 30000
});

// Intercept requests to attach JWT token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await API.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData: { name: string; email: string; password: string; role?: string }) => {
    const res = await API.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await API.get('/auth/me');
    return res.data;
  }
};

export const customerAPI = {
  uploadDataset: async (formData: FormData, onUploadProgress?: (progressEvent: any) => void) => {
    const res = await API.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress
    });
    return res.data;
  },
  getCustomers: async (params?: any) => {
    const res = await API.get('/customers', { params });
    return res.data;
  },
  getCustomerById: async (id: string) => {
    const res = await API.get(`/customer/${id}`);
    return res.data;
  },
  createCustomer: async (customerData: Partial<Customer>) => {
    const res = await API.post('/customer', customerData);
    return res.data;
  },
  updateCustomer: async (id: string, updates: Partial<Customer>) => {
    const res = await API.put(`/customer/${id}`, updates);
    return res.data;
  },
  deleteCustomer: async (id: string) => {
    const res = await API.delete(`/customer/${id}`);
    return res.data;
  }
};

export const analyticsAPI = {
  getDashboardSummary: async () => {
    const res = await API.get('/dashboard');
    return res.data as {
      success: boolean;
      kpis: DashboardKPIs;
      topCities: TopCity[];
      topCategories: TopCategory[];
      mostLoyal: LoyalCustomer[];
    };
  },
  getAnalyticsCharts: async () => {
    const res = await API.get('/analytics');
    return res.data;
  },
  getAIInsights: async () => {
    const res = await API.get('/insights');
    return res.data as {
      success: boolean;
      insights: AIInsight[];
      marketingSuggestions: MarketingSuggestion[];
    };
  }
};

export const mlAPI = {
  trainModel: async () => {
    const res = await API.post('/train');
    return res.data;
  },
  predictSegment: async (customerData: any) => {
    const res = await API.post('/predict', customerData);
    return res.data;
  },
  getClusters: async () => {
    const res = await API.get('/clusters');
    return res.data as { success: boolean; clusters: SegmentProfile[] };
  }
};

export default API;
