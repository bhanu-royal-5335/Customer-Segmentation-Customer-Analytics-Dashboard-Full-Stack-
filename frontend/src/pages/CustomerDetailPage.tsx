import React from 'react';
import { Customer } from '../types';
import { X, User, MapPin, Briefcase, Award, ShieldAlert, Sparkles, ShoppingBag, DollarSign, Calendar, Target, Heart } from 'lucide-react';

interface CustomerDetailPageProps {
  customer: Customer;
  onClose: () => void;
}

export const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({ customer, onClose }) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-card w-full max-w-3xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white">{customer.name}</h2>
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: customer.clusterColor || '#3B82F6' }}
                >
                  {customer.clusterBadge || `Cluster ${customer.clusterId}`}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {customer.customerId} • {customer.occupation} • {customer.education}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400">Churn Risk Profile</div>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold uppercase mt-1 ${
                customer.churnRisk === 'High'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : customer.churnRisk === 'Medium'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {customer.churnRisk === 'High' && <ShieldAlert className="w-3.5 h-3.5 mr-1" />}
              {customer.churnRisk || 'Low Churn Risk'}
            </span>
          </div>
        </div>

        {/* Financial & Engagement Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 block">Annual Income</span>
            <span className="text-base font-extrabold text-white font-mono">${customer.income?.toLocaleString()}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 block">Annual Spend</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">${customer.annualSpending?.toLocaleString()}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 block">Avg Order Value</span>
            <span className="text-base font-extrabold text-blue-400 font-mono">${customer.averageOrderValue}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 block">Model Lifetime Value</span>
            <span className="text-base font-extrabold text-indigo-400 font-mono">${customer.lifetimeValue?.toLocaleString()}</span>
          </div>
        </div>

        {/* Persona Segment Info Box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-500/30 space-y-2">
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Assigned Segment: {customer.segmentName}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Classified via K-Means algorithm using StandardScaler on Age, Income, Spend, Frequency, and Order Count.
          </p>
        </div>

        {/* Detailed Demographics & Order History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2.5">
            <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Demographic Profile</h4>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Gender & Age:</span>
              <span className="font-semibold">{customer.gender}, {customer.age} years</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Location:</span>
              <span className="font-semibold">{customer.city}, {customer.country}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Occupation:</span>
              <span className="font-semibold">{customer.occupation}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Education:</span>
              <span className="font-semibold">{customer.education}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Customer Rating:</span>
              <span className="font-semibold text-amber-400">★ {customer.customerRating} / 5.0</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2.5">
            <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">Purchase & Behavior Profile</h4>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Total Orders:</span>
              <span className="font-semibold">{customer.numberOfOrders} orders</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Purchase Frequency:</span>
              <span className="font-semibold">{customer.purchaseFrequency} orders / yr</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Preferred Category:</span>
              <span className="font-semibold text-blue-400">{customer.preferredCategory}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Last Purchase Date:</span>
              <span className="font-semibold text-emerald-400">{customer.lastPurchaseDate}</span>
            </div>
          </div>
        </div>

        {/* AI Targeted Recommendation */}
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1.5">
          <div className="flex items-center space-x-2 text-purple-300 font-bold">
            <Target className="w-4 h-4 text-purple-400" />
            <span>AI Next Best Action & Cross-Sell Strategy</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Target {customer.name} with premium product line recommendations in <span className="text-purple-300 font-semibold">{customer.preferredCategory}</span>.
            {customer.churnRisk === 'High'
              ? ' High urgency: Deploy win-back promo voucher within 48 hours.'
              : ' Send exclusive VIP invitation for early access catalog.'}
          </p>
        </div>
      </div>
    </div>
  );
};
