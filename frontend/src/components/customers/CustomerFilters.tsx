import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface CustomerFiltersProps {
  filters: any;
  onChange: (key: string, value: any) => void;
  onReset: () => void;
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({ filters, onChange, onReset }) => {
  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, ID, city, or category..."
            value={filters.search || ''}
            onChange={(e) => onChange('search', e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60 transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Filter Dropdowns & Range Sliders */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-800 text-xs">
        {/* Cluster Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">ML Cluster</label>
          <select
            value={filters.cluster ?? 'All'}
            onChange={(e) => onChange('cluster', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Segments</option>
            <option value="0">Cluster 0 (Premium)</option>
            <option value="1">Cluster 1 (Loyal)</option>
            <option value="2">Cluster 2 (Potential)</option>
            <option value="3">Cluster 3 (Budget)</option>
            <option value="4">Cluster 4 (At Risk)</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Gender</label>
          <select
            value={filters.gender || 'All'}
            onChange={(e) => onChange('gender', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">City</label>
          <select
            value={filters.city || 'All'}
            onChange={(e) => onChange('city', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Cities</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Delhi">Delhi</option>
            <option value="Chennai">Chennai</option>
            <option value="Pune">Pune</option>
            <option value="Kolkata">Kolkata</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category</label>
          <select
            value={filters.category || 'All'}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Beauty">Beauty</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Sports">Sports</option>
            <option value="Books">Books</option>
          </select>
        </div>

        {/* Min Income */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Min Income ($)</label>
          <input
            type="number"
            placeholder="e.g. 40000"
            value={filters.minIncome || ''}
            onChange={(e) => onChange('minIncome', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Max Income */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Max Income ($)</label>
          <input
            type="number"
            placeholder="e.g. 120000"
            value={filters.maxIncome || ''}
            onChange={(e) => onChange('maxIncome', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
