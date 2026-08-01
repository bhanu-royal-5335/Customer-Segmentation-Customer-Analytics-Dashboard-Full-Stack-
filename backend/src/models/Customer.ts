import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    customerId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, default: 'Unspecified' },
    income: { type: Number, required: true, default: 0 },
    occupation: { type: String, default: 'Other' },
    education: { type: String, default: 'Bachelor' },
    city: { type: String, required: true, index: true },
    country: { type: String, default: 'India', index: true },
    purchaseFrequency: { type: Number, default: 0 },
    annualSpending: { type: Number, required: true, default: 0 },
    lastPurchaseDate: { type: String },
    numberOfOrders: { type: Number, default: 1 },
    averageOrderValue: { type: Number, default: 0 },
    preferredCategory: { type: String, default: 'General', index: true },
    customerRating: { type: Number, default: 4.0 },
    clusterId: { type: Number, default: 0, index: true },
    segmentName: { type: String, default: 'High Value / Premium Customers' },
    clusterBadge: { type: String, default: 'Premium' },
    clusterColor: { type: String, default: '#3B82F6' },
    churnRisk: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    lifetimeValue: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
