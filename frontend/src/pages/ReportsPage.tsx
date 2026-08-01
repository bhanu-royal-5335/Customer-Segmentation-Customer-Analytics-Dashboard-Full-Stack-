import React, { useState, useEffect } from 'react';
import { customerAPI, analyticsAPI } from '../services/api';
import { Customer } from '../types';
import { FileText, Download, Printer, FileSpreadsheet, CheckCircle, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ReportsPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await customerAPI.getCustomers({ limit: 500 });
        if (res.customers) setCustomers(res.customers);
      } catch (e) {
        console.warn('Failed to load customers for reporting');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const generatePDFReport = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235); // Blue
    doc.text('Customer Segmentation & Analytics Executive Report', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} | Total Customers Analyzed: ${customers.length}`, 14, 28);

    // Table Data Formatting
    const tableData = customers.map((c) => [
      c.customerId,
      c.name,
      c.segmentName,
      `$${c.income?.toLocaleString()}`,
      `$${c.annualSpending?.toLocaleString()}`,
      c.city,
      c.churnRisk || 'Low'
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Customer Name', 'ML Cluster Segment', 'Income', 'Annual Spend', 'City', 'Churn Risk']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 3 }
    });

    doc.save('Customer_Segmentation_Executive_Report.pdf');
    setStatusMessage('PDF Executive Report downloaded successfully!');
  };

  const generateExcelReport = () => {
    const worksheet = XLSX.utils.json_to_sheet(customers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'All Customers');
    XLSX.writeFile(workbook, 'Customer_Segmentation_Master_Report.xlsx');
    setStatusMessage('Excel Master Workbook downloaded successfully!');
  };

  const generateCSVExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(customers);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Customer_Segmentation_Data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatusMessage('CSV Dataset exported successfully!');
  };

  const handlePrintDashboard = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Executive Reports & Data Export</h1>
        <p className="text-xs text-slate-400 mt-1">
          Export full customer analytics reports in PDF format, Excel workbooks, raw CSV datasets, or trigger print layout.
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Executive Report */}
        <div className="glass-card p-6 space-y-4 hover:border-blue-500/50 transition-colors">
          <div className="p-3 w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">PDF Executive Report</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Formatted multi-page PDF executive document featuring customer cluster summary tables, header branding, and segment distributions.
            </p>
          </div>
          <button
            onClick={generatePDFReport}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white gradient-bg-primary hover:opacity-90 transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download PDF</span>
          </button>
        </div>

        {/* Excel Master Workbook */}
        <div className="glass-card p-6 space-y-4 hover:border-emerald-500/50 transition-colors">
          <div className="p-3 w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Excel Master Spreadsheet</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Complete `.xlsx` dataset file featuring all 16 raw customer columns alongside assigned K-Means cluster IDs and lifetime value calculations.
            </p>
          </div>
          <button
            onClick={generateExcelReport}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Master Excel Workbook</span>
          </button>
        </div>

        {/* CSV Raw Data */}
        <div className="glass-card p-6 space-y-4 hover:border-blue-500/50 transition-colors">
          <div className="p-3 w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">CSV Raw Export</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Standard Comma-Separated Values file formatted for easy import into Tableau, PowerBI, or downstream database pipelines.
            </p>
          </div>
          <button
            onClick={generateCSVExport}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export CSV Dataset</span>
          </button>
        </div>

        {/* Print Dashboard View */}
        <div className="glass-card p-6 space-y-4 hover:border-purple-500/50 transition-colors">
          <div className="p-3 w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Print / Save View</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Triggers the browser print dialog with optimized print stylesheet rules that hide navigation bars and render crisp charts.
            </p>
          </div>
          <button
            onClick={handlePrintDashboard}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-purple-300 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 transition-all flex items-center justify-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Current Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
