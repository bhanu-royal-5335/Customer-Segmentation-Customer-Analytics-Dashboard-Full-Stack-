import React, { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';
import { Customer } from '../types';
import { CustomerFilters } from '../components/customers/CustomerFilters';
import { CustomerTable } from '../components/customers/CustomerTable';
import { CustomerDetailPage } from './CustomerDetailPage';
import { Users, Download, Plus, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const defaultFilters = {
    search: '',
    gender: 'All',
    city: 'All',
    category: 'All',
    cluster: 'All',
    minIncome: '',
    maxIncome: ''
  };

  const [filters, setFilters] = useState<any>(defaultFilters);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await customerAPI.getCustomers(filters);
      if (res.success && res.customers) {
        setCustomers(res.customers);
        setTotalCount(res.total ?? res.customers.length);
      }
    } catch (e) {
      console.warn('Failed to load customers list', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this customer record?')) return;
    try {
      await customerAPI.deleteCustomer(id);
      fetchCustomers();
    } catch (e) {
      alert('Error deleting customer record.');
    }
  };

  const handleExportCSV = () => {
    if (customers.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(customers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Customers');
    XLSX.writeFile(workbook, 'filtered_customer_directory.xlsx');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Customer Profiles & Analytics Directory</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {totalCount} Records
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, and inspect segmented customer profiles across demographic & financial metrics
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Directory Excel</span>
        </button>
      </div>

      <CustomerFilters filters={filters} onChange={handleFilterChange} onReset={handleResetFilters} />

      <CustomerTable
        customers={customers}
        isLoading={isLoading}
        onSelectCustomer={(c) => setSelectedCustomer(c)}
        onDeleteCustomer={handleDeleteCustomer}
      />

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailPage
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};
