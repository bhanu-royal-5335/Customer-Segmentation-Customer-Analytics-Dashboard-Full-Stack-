import React from 'react';
import { Customer } from '../../types';
import { Eye, Edit3, Trash2, ShieldAlert, Award } from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  onSelectCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  isLoading,
  onSelectCustomer,
  onDeleteCustomer
}) => {
  if (isLoading) {
    return (
      <div className="glass-card p-8 text-center text-slate-400 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-medium">Loading customer database records...</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="glass-card p-12 text-center text-slate-400 space-y-3">
        <div className="p-3 w-12 h-12 rounded-full bg-slate-800 border border-slate-700 mx-auto text-slate-500 flex items-center justify-center">
          <Award className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-white">No Customer Profiles Found</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Try adjusting your search criteria or upload a new CSV/Excel customer dataset.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700/80">
            <tr>
              <th className="py-3.5 px-4">Customer ID & Name</th>
              <th className="py-3.5 px-4">ML Segment Cluster</th>
              <th className="py-3.5 px-4">Income</th>
              <th className="py-3.5 px-4">Annual Spend</th>
              <th className="py-3.5 px-4">Orders (Freq)</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Churn Risk</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {customers.map((c) => (
              <tr key={c._id || c.customerId} className="hover:bg-slate-800/60 transition-colors group">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                    {c.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{c.customerId} • {c.age} yrs ({c.gender})</div>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: c.clusterColor || '#3B82F6' }}
                  >
                    {c.clusterBadge || `Cluster ${c.clusterId}`}
                  </span>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[140px]">{c.segmentName}</div>
                </td>
                <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                  ${c.income?.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                  ${c.annualSpending?.toLocaleString()}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-200">{c.numberOfOrders} orders</div>
                  <div className="text-[11px] text-slate-400">{c.purchaseFrequency} / yr</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="text-slate-200 font-medium">{c.city}</div>
                  <div className="text-[11px] text-slate-400">{c.country}</div>
                </td>
                <td className="py-3.5 px-4 font-medium text-amber-400">
                  ★ {c.customerRating?.toFixed(1)}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      c.churnRisk === 'High'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : c.churnRisk === 'Medium'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {c.churnRisk === 'High' && <ShieldAlert className="w-3 h-3 mr-1" />}
                    {c.churnRisk || 'Low'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-1">
                  <button
                    onClick={() => onSelectCustomer(c)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                    title="View Customer Profile"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCustomer(c._id || c.customerId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
