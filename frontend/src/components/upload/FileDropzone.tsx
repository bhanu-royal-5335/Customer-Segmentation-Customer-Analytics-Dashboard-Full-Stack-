import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { customerAPI } from '../../services/api';

interface FileDropzoneProps {
  onSuccess: (data: any) => void;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    setSuccessMessage(null);
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
      setFile(selectedFile);
    } else {
      setError('Unsupported file type. Please upload a CSV (.csv) or Excel (.xlsx, .xls) file.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setProgress(10);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await customerAPI.uploadDataset(formData, (evt) => {
        if (evt.total) {
          const percent = Math.round((evt.loaded * 100) / evt.total);
          setProgress(percent);
        }
      });

      setProgress(100);
      setSuccessMessage(res.message || 'Dataset uploaded & segmented successfully!');
      onSuccess(res);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error processing dataset upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadSample = () => {
    const csvContent =
`Customer ID,Name,Age,Gender,Income,Occupation,Education,City,Country,Purchase Frequency,Annual Spending,Last Purchase Date,Number of Orders,Average Order Value,Preferred Category,Customer Rating
CUST-1001,Sophia Martinez,34,Female,85000,Software Engineer,Master,Hyderabad,India,18,4200,2026-07-28,24,175,Electronics,4.8
CUST-1002,Liam Johnson,42,Male,95000,Financial Analyst,Bachelor,Mumbai,India,24,6800,2026-07-30,36,188,Fashion,4.9
CUST-1003,Emma Williams,28,Female,52000,Graphic Designer,Bachelor,Bangalore,India,8,1900,2026-07-15,10,190,Beauty,4.1
CUST-1004,Noah Brown,55,Male,115000,Executive Director,Doctorate,Delhi,India,30,9500,2026-07-29,45,211,Electronics,5.0
CUST-1005,Olivia Jones,23,Female,38000,Student,Bachelor,Chennai,India,4,850,2026-06-20,5,170,Books,3.8`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_customer_dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`glass-card p-10 border-2 border-dashed cursor-pointer text-center transition-all duration-200 ${
          isDragging ? 'border-blue-500 bg-blue-500/10 scale-[1.01]' : 'border-slate-700/80 hover:border-blue-500/50 hover:bg-slate-800/40'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.xlsx,.xls"
          className="hidden"
        />

        <div className="p-4 w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 mx-auto mb-4 flex items-center justify-center">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          {file ? file.name : 'Upload Customer Dataset'}
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
          Drag and drop your customer spreadsheet here, or click to browse files. Supports CSV, XLSX, and XLS formats.
        </p>

        {file && (
          <div className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <FileSpreadsheet className="w-4 h-4" />
            <span>{(file.size / 1024).toFixed(1)} KB</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="glass-card p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <span>Parsing spreadsheet & triggering K-Means ML Clustering...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Alerts */}
      {error && (
        <div className="flex items-center space-x-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center space-x-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={handleDownloadSample}
          className="flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl border border-slate-700/60 hover:bg-slate-800 transition-colors w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>Download Sample Dataset CSV</span>
        </button>

        <button
          disabled={!file || isUploading}
          onClick={handleUpload}
          className={`flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition-all w-full sm:w-auto ${
            !file || isUploading
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'gradient-bg-primary hover:opacity-90 shadow-blue-500/20'
          }`}
        >
          <span>Run AI Segmentation</span>
        </button>
      </div>
    </div>
  );
};
