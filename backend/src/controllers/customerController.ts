import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import axios from 'axios';
import Customer, { ICustomer } from '../models/Customer';
import Dataset from '../models/Dataset';
import { isMongoConnected } from '../config/db';
import { mapRawRecordToCustomer } from '../utils/columnMapper';
import { mockCustomersStore, setMockCustomersStore, MockCustomer } from '../utils/mockData';

const PYTHON_API = process.env.PYTHON_API || 'http://127.0.0.1:5001';

export const uploadDataset = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No dataset file attached to request' });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let rawRecords: any[] = [];

    if (ext === '.csv') {
      const csvText = fs.readFileSync(filePath, 'utf8');
      const parseResult = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      rawRecords = parseResult.data;
    } else {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      rawRecords = XLSX.utils.sheet_to_json(sheet);
    }

    if (rawRecords.length === 0) {
      return res.status(400).json({ error: 'The uploaded file contains no data rows.' });
    }

    // 1. Map columns to standardized Customer objects
    const mappedCustomers = rawRecords.map((raw, idx) => mapRawRecordToCustomer(raw, idx));

    // 2. Attempt Python ML service call to perform K-Means Clustering
    let segmentationResults: any = null;
    try {
      const mlResponse = await axios.post(`${PYTHON_API}/train`, mappedCustomers, { timeout: 10000 });
      if (mlResponse.data && mlResponse.data.success) {
        segmentationResults = mlResponse.data;
      }
    } catch (mlErr: any) {
      console.warn(`Python ML API call failed (${mlErr.message}). Using local heuristic cluster calculation.`);
    }

    // Assign Cluster details based on ML API result or heuristic fallback
    const enrichedCustomers = mappedCustomers.map((cust, idx) => {
      let clusterId = 0;
      let segmentName = 'High Value / Premium Customers';
      let clusterBadge = 'Premium';
      let clusterColor = '#3B82F6';

      if (segmentationResults && segmentationResults.cluster_labels) {
        clusterId = segmentationResults.cluster_labels[idx] ?? 0;
        const profile = segmentationResults.profiles?.find((p: any) => p.cluster_id === clusterId);
        if (profile) {
          segmentName = profile.name;
          clusterBadge = profile.badge;
          clusterColor = profile.color;
        }
      } else {
        // Fallback segment logic based on Income & Spending
        if (cust.income > 80000 && cust.annualSpending > 4000) {
          clusterId = 0; segmentName = 'High Value / Premium Customers'; clusterBadge = 'Premium'; clusterColor = '#3B82F6';
        } else if (cust.purchaseFrequency > 15) {
          clusterId = 1; segmentName = 'Loyal Frequent Buyers'; clusterBadge = 'Loyal'; clusterColor = '#10B981';
        } else if (cust.income > 70000 && cust.annualSpending <= 4000) {
          clusterId = 2; segmentName = 'Potential High-Spenders'; clusterBadge = 'Potential'; clusterColor = '#8B5CF6';
        } else if (cust.annualSpending <= 2000) {
          clusterId = 3; segmentName = 'Budget / Price Sensitive'; clusterBadge = 'Budget'; clusterColor = '#F59E0B';
        } else {
          clusterId = 4; segmentName = 'Inactive / At Risk'; clusterBadge = 'Needs Marketing'; clusterColor = '#EF4444';
        }
      }

      let churnRisk: 'Low' | 'Medium' | 'High' = 'Low';
      if (clusterId === 4) churnRisk = 'High';
      else if (clusterId === 3 || clusterId === 2) churnRisk = 'Medium';

      return {
        ...cust,
        clusterId,
        segmentName,
        clusterBadge,
        clusterColor,
        churnRisk
      };
    });

    // Save to Database or In-Memory Mock Store
    if (isMongoConnected) {
      await Customer.deleteMany({}); // Refresh dataset for clean view
      await Customer.insertMany(enrichedCustomers);
      await Dataset.create({
        filename: req.file.filename,
        originalName: req.file.originalname,
        recordCount: enrichedCustomers.length,
        status: 'segmented',
        nClusters: segmentationResults?.n_clusters || 4
      });
    } else {
      const newMockStore: MockCustomer[] = enrichedCustomers.map((c, idx) => ({
        _id: `upload_cust_${idx + 1}`,
        ...c,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      setMockCustomersStore(newMockStore);
    }

    return res.status(200).json({
      success: true,
      message: `Successfully processed & segmented ${enrichedCustomers.length} customer records.`,
      recordCount: enrichedCustomers.length,
      nClusters: segmentationResults?.n_clusters || 4,
      profiles: segmentationResults?.profiles || []
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: error.message || 'Server error processing dataset upload' });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const {
      search,
      gender,
      city,
      country,
      category,
      cluster,
      minIncome,
      maxIncome,
      minAge,
      maxAge,
      page = 1,
      limit = 100,
      sortBy = 'annualSpending',
      order = 'desc'
    } = req.query;

    if (isMongoConnected) {
      const query: any = {};

      if (search) {
        query.$or = [
          { name: { $regex: String(search), $options: 'i' } },
          { customerId: { $regex: String(search), $options: 'i' } },
          { city: { $regex: String(search), $options: 'i' } },
          { preferredCategory: { $regex: String(search), $options: 'i' } }
        ];
      }

      if (gender && gender !== 'All') query.gender = gender;
      if (city && city !== 'All') query.city = city;
      if (country && country !== 'All') query.country = country;
      if (category && category !== 'All') query.preferredCategory = category;
      if (cluster !== undefined && cluster !== '' && cluster !== 'All') query.clusterId = Number(cluster);

      if (minIncome || maxIncome) {
        query.income = {};
        if (minIncome) query.income.$gte = Number(minIncome);
        if (maxIncome) query.income.$lte = Number(maxIncome);
      }

      if (minAge || maxAge) {
        query.age = {};
        if (minAge) query.age.$gte = Number(minAge);
        if (maxAge) query.age.$lte = Number(maxAge);
      }

      const sortOptions: any = {};
      sortOptions[String(sortBy)] = order === 'asc' ? 1 : -1;

      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;

      const customers = await Customer.find(query).sort(sortOptions).skip(skip).limit(limitNum);
      const total = await Customer.countDocuments(query);

      return res.json({
        success: true,
        customers,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
      });
    } else {
      // In-Memory Filtering Logic
      let filtered = [...mockCustomersStore];

      if (search) {
        const s = String(search).toLowerCase();
        filtered = filtered.filter(
          c =>
            c.name.toLowerCase().includes(s) ||
            c.customerId.toLowerCase().includes(s) ||
            c.city.toLowerCase().includes(s) ||
            c.preferredCategory.toLowerCase().includes(s)
        );
      }

      if (gender && gender !== 'All') filtered = filtered.filter(c => c.gender === gender);
      if (city && city !== 'All') filtered = filtered.filter(c => c.city === city);
      if (country && country !== 'All') filtered = filtered.filter(c => c.country === country);
      if (category && category !== 'All') filtered = filtered.filter(c => c.preferredCategory === category);
      if (cluster !== undefined && cluster !== '' && cluster !== 'All') filtered = filtered.filter(c => c.clusterId === Number(cluster));

      if (minIncome) filtered = filtered.filter(c => c.income >= Number(minIncome));
      if (maxIncome) filtered = filtered.filter(c => c.income <= Number(maxIncome));
      if (minAge) filtered = filtered.filter(c => c.age >= Number(minAge));
      if (maxAge) filtered = filtered.filter(c => c.age <= Number(maxAge));

      // Sorting
      filtered.sort((a: any, b: any) => {
        const field = String(sortBy);
        const valA = a[field] ?? 0;
        const valB = b[field] ?? 0;
        return order === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
      });

      return res.json({
        success: true,
        customers: filtered,
        total: filtered.length,
        page: 1,
        totalPages: 1
      });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const customer = await Customer.findById(id);
      if (customer) return res.json({ success: true, customer });
    }
    const found = mockCustomersStore.find(c => c._id === id || c.customerId === id);
    if (!found) {
      return res.status(404).json({ error: 'Customer record not found' });
    }
    return res.json({ success: true, customer: found });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const mapped = mapRawRecordToCustomer(data, Math.floor(Math.random() * 1000));

    // Simple ML segment predictor call
    let segmentInfo = { clusterId: 0, segmentName: 'High Value / Premium Customers', clusterBadge: 'Premium', clusterColor: '#3B82F6' };
    try {
      const predRes = await axios.post(`${PYTHON_API}/predict`, mapped, { timeout: 3000 });
      if (predRes.data && predRes.data.predictions) {
        const p = predRes.data.predictions;
        segmentInfo = {
          clusterId: p.cluster_id,
          segmentName: p.segment_name,
          clusterBadge: p.badge,
          clusterColor: p.color
        };
      }
    } catch (e) {
      // Heuristic fallback
      if (mapped.annualSpending < 2000) {
        segmentInfo = { clusterId: 3, segmentName: 'Budget / Price Sensitive', clusterBadge: 'Budget', clusterColor: '#F59E0B' };
      }
    }

    const newCustomerObj = {
      ...mapped,
      ...segmentInfo,
      churnRisk: (segmentInfo.clusterId === 4 ? 'High' : segmentInfo.clusterId === 3 ? 'Medium' : 'Low') as 'Low' | 'Medium' | 'High'
    };

    if (isMongoConnected) {
      const created = await Customer.create(newCustomerObj);
      return res.status(201).json({ success: true, customer: created });
    } else {
      const mockRecord: MockCustomer = {
        _id: `cust_new_${Date.now()}`,
        ...newCustomerObj,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setMockCustomersStore([mockRecord, ...mockCustomersStore]);
      return res.status(201).json({ success: true, customer: mockRecord });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected) {
      const updated = await Customer.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) return res.status(404).json({ error: 'Customer not found' });
      return res.json({ success: true, customer: updated });
    } else {
      const index = mockCustomersStore.findIndex(c => c._id === id || c.customerId === id);
      if (index === -1) return res.status(404).json({ error: 'Customer not found' });
      
      const updatedMock = { ...mockCustomersStore[index], ...updates, updatedAt: new Date().toISOString() };
      mockCustomersStore[index] = updatedMock;
      return res.json({ success: true, customer: updatedMock });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const deleted = await Customer.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Customer not found' });
    } else {
      setMockCustomersStore(mockCustomersStore.filter(c => c._id !== id && c.customerId !== id));
    }
    return res.json({ success: true, message: 'Customer record deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
