export interface Customer {
  _id: string;
  customerId: string;
  name: string;
  age: number;
  gender: string;
  income: number;
  occupation: string;
  education: string;
  city: string;
  country: string;
  purchaseFrequency: number;
  annualSpending: number;
  lastPurchaseDate: string;
  numberOfOrders: number;
  averageOrderValue: number;
  preferredCategory: string;
  customerRating: number;
  clusterId: number;
  segmentName: string;
  clusterBadge: string;
  clusterColor: string;
  churnRisk: 'Low' | 'Medium' | 'High';
  lifetimeValue: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SegmentProfile {
  cluster_id: number;
  name: string;
  badge: string;
  color: string;
  description: string;
  strategy: string;
  count?: number;
  percentage?: number;
  averages?: {
    Age?: number;
    Income?: number;
    'Annual Spending'?: number;
    'Purchase Frequency'?: number;
    'Average Order Value'?: number;
    'Number of Orders'?: number;
  };
}

export interface DashboardKPIs {
  totalCustomers: number;
  activeCustomers: number;
  highValueCustomers: number;
  lowValueCustomers: number;
  avgIncome: number;
  avgSpending: number;
  avgFrequency: number;
  avgRating: number;
  avgCLV: number;
}

export interface TopCity {
  city: string;
  count: number;
}

export interface TopCategory {
  category: string;
  count: number;
}

export interface LoyalCustomer {
  id: string;
  customerId: string;
  name: string;
  orders: number;
  spending: number;
  city: string;
  segment: string;
}

export interface AIInsight {
  id: string;
  title: string;
  type: string;
  icon: string;
  text: string;
  recommendation: string;
}

export interface MarketingSuggestion {
  cluster: string;
  action: string;
  channel: string;
  impact: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
}
