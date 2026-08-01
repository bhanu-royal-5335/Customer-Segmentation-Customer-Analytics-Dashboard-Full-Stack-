import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileDropzone } from '../components/upload/FileDropzone';
import { FileSpreadsheet, Check, ArrowRight, Table } from 'lucide-react';

export const UploadPage: React.FC = () => {
  const [uploadResult, setUploadResult] = useState<any>(null);
  const navigate = useNavigate();

  const handleUploadSuccess = (data: any) => {
    setUploadResult(data);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Dataset Upload & AI Segmentation</h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload customer CSV or Excel files. Our backend automatically normalizes headers and runs Python K-Means clustering.
        </p>
      </div>

      <FileDropzone onSuccess={handleUploadSuccess} />

      {uploadResult && (
        <div className="glass-card p-6 border-t-4 border-t-emerald-500 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Dataset Successfully Segmented</h3>
                <p className="text-xs text-slate-400">
                  Imported {uploadResult.recordCount} rows into MongoDB Atlas and classified into {uploadResult.nClusters} optimal clusters.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-bg-primary hover:opacity-90 transition-all shadow-lg"
            >
              <span>View Dashboard Analytics</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Automatic Column Mapping Guide */}
      <div className="glass-card p-6">
        <h3 className="text-base font-bold text-white mb-2 flex items-center space-x-2">
          <Table className="w-5 h-5 text-blue-400" />
          <span>Automatic Header Mapping System</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Our column mapper handles variations in dataset header names seamlessly. You can upload spreadsheets containing any of the following standard column names:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          {[
            { label: 'Customer ID', keys: 'Customer ID, ID, Cust_ID' },
            { label: 'Name', keys: 'Name, Customer Name, Client' },
            { label: 'Age', keys: 'Age, Years' },
            { label: 'Gender', keys: 'Gender, Sex' },
            { label: 'Income', keys: 'Income, Annual Income, Salary' },
            { label: 'Occupation', keys: 'Occupation, Profession, Role' },
            { label: 'City', keys: 'City, Location, Town' },
            { label: 'Annual Spending', keys: 'Annual Spending, Spend, Total Spend' },
            { label: 'Purchase Frequency', keys: 'Purchase Frequency, Freq' },
            { label: 'Number of Orders', keys: 'Number of Orders, Orders' },
            { label: 'Avg Order Value', keys: 'Average Order Value, AOV' },
            { label: 'Preferred Category', keys: 'Preferred Category, Category' }
          ].map((col, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="font-semibold text-blue-400 block">{col.label}</span>
              <span className="text-[11px] text-slate-500 block truncate">{col.keys}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
