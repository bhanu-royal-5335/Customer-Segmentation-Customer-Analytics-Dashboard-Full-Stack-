import mongoose, { Schema, Document } from 'mongoose';

export interface IDataset extends Document {
  filename: string;
  originalName: string;
  recordCount: number;
  uploadedBy: string;
  status: 'processing' | 'segmented' | 'failed';
  nClusters: number;
  createdAt: Date;
}

const DatasetSchema: Schema = new Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    recordCount: { type: Number, default: 0 },
    uploadedBy: { type: String, default: 'System' },
    status: { type: String, enum: ['processing', 'segmented', 'failed'], default: 'processing' },
    nClusters: { type: Number, default: 4 }
  },
  { timestamps: true }
);

export default mongoose.model<IDataset>('Dataset', DatasetSchema);
