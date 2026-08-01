import { Request, Response } from 'express';
import axios from 'axios';
import Customer from '../models/Customer';
import { isMongoConnected } from '../config/db';
import { mockCustomersStore } from '../utils/mockData';

const PYTHON_API = process.env.PYTHON_API || 'http://127.0.0.1:5001';

export const trainModel = async (req: Request, res: Response) => {
  try {
    let customers: any[] = [];
    if (isMongoConnected) customers = await Customer.find({});
    else customers = mockCustomersStore;

    if (customers.length === 0) customers = mockCustomersStore;

    const response = await axios.post(`${PYTHON_API}/train`, customers, { timeout: 15000 });
    return res.json(response.data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error communicating with Python ML service' });
  }
};

export const predictCustomerSegment = async (req: Request, res: Response) => {
  try {
    const customerData = req.body;
    const response = await axios.post(`${PYTHON_API}/predict`, customerData, { timeout: 5000 });
    return res.json(response.data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error executing ML prediction' });
  }
};

export const getMLClusters = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${PYTHON_API}/clusters`, { timeout: 5000 });
    return res.json(response.data);
  } catch (error: any) {
    // Fallback cluster list
    return res.json({
      success: true,
      clusters: [
        { cluster_id: 0, name: 'High Value / Premium Customers', badge: 'Premium', color: '#3B82F6', description: 'High income & spending' },
        { cluster_id: 1, name: 'Loyal Frequent Buyers', badge: 'Loyal', color: '#10B981', description: 'High order frequency' },
        { cluster_id: 2, name: 'Potential High-Spenders', badge: 'Potential', color: '#8B5CF6', description: 'High income, moderate spend' },
        { cluster_id: 3, name: 'Budget / Price Sensitive', badge: 'Budget', color: '#F59E0B', description: 'Modest budget, value focused' },
        { cluster_id: 4, name: 'Inactive / At Risk', badge: 'Needs Marketing', color: '#EF4444', description: 'Low recent engagement' }
      ]
    });
  }
};
