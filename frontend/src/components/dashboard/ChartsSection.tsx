import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
} from 'recharts';

interface ChartsSectionProps {
  analyticsData: any;
}

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

export const ChartsSection: React.FC<ChartsSectionProps> = ({ analyticsData }) => {
  if (!analyticsData) return null;

  const {
    genderDistribution = [],
    cityDistribution = [],
    clusterDistribution = [],
    incomeVsSpending = [],
    bubbleData = [],
    ageDistribution = [],
    radarData = [],
    correlationMatrix = []
  } = analyticsData;

  const lineGrowthData = [
    { month: 'Jan', customers: 120, revenue: 45000 },
    { month: 'Feb', customers: 145, revenue: 52000 },
    { month: 'Mar', customers: 180, revenue: 68000 },
    { month: 'Apr', customers: 210, revenue: 74000 },
    { month: 'May', customers: 250, revenue: 89000 },
    { month: 'Jun', customers: 290, revenue: 105000 },
    { month: 'Jul', customers: 340, revenue: 128000 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Bar Chart: Customer Count by City */}
      <div className="glass-card p-5">
        <h4 className="text-base font-semibold text-white mb-4 flex items-center justify-between">
          <span>Customer Count by City (Bar Chart)</span>
          <span className="text-xs text-blue-400 font-normal">Geographic Footprint</span>
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityDistribution}>
              <XAxis dataKey="city" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '0.75rem', color: '#FFF' }} />
              <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Donut Chart: Cluster Distribution */}
      <div className="glass-card p-5">
        <h4 className="text-base font-semibold text-white mb-4 flex items-center justify-between">
          <span>ML Segment Breakdown (Donut Chart)</span>
          <span className="text-xs text-indigo-400 font-normal">K-Means Groups</span>
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={clusterDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {clusterDistribution.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '0.75rem', color: '#FFF' }} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#94A3B8', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Scatter Plot: Income vs Annual Spending */}
      <div className="glass-card p-5">
        <h4 className="text-base font-semibold text-white mb-4 flex items-center justify-between">
          <span>Income vs. Annual Spending (Scatter Plot)</span>
          <span className="text-xs text-emerald-400 font-normal">Spending Capability</span>
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <XAxis type="number" dataKey="income" name="Income ($)" stroke="#94A3B8" fontSize={11} unit="$" />
              <YAxis type="number" dataKey="spending" name="Spending ($)" stroke="#94A3B8" fontSize={11} unit="$" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '0.75rem', color: '#FFF' }} />
              <Scatter name="Customers" data={incomeVsSpending} fill="#8B5CF6">
                {incomeVsSpending.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.clusterColor || COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Line Chart: Customer Growth & Revenue Trend */}
      <div className="glass-card p-5">
        <h4 className="text-base font-semibold text-white mb-4 flex items-center justify-between">
          <span>Customer Growth & Revenue (Line Chart)</span>
          <span className="text-xs text-amber-400 font-normal">Cumulative Trend</span>
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineGrowthData}>
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '0.75rem', color: '#FFF' }} />
              <Line type="monotone" dataKey="customers" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Radar Chart: Customer Persona Profiles */}
      <div className="glass-card p-5">
        <h4 className="text-base font-semibold text-white mb-4 flex items-center justify-between">
          <span>Cluster Feature Profiles (Radar Chart)</span>
          <span className="text-xs text-purple-400 font-normal">Multi-Dimensional Comparison</span>
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="feature" stroke="#94A3B8" fontSize={11} />
              <PolarRadiusAxis stroke="#475569" fontSize={10} />
              <Radar name="Cluster 0 (Premium)" dataKey="Cluster_0" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              <Radar name="Cluster 1 (Loyal)" dataKey="Cluster_1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              <Radar name="Cluster 2 (Potential)" dataKey="Cluster_2" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '0.75rem', color: '#FFF' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. Heatmap / Correlation Matrix Grid */}
      <div className="glass-card p-5">
        <h4 className="text-base font-semibold text-white mb-4 flex items-center justify-between">
          <span>Feature Correlation Matrix (Heatmap)</span>
          <span className="text-xs text-rose-400 font-normal">Feature Interdependence</span>
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-2 text-left text-slate-400 font-medium">Feature</th>
                <th className="p-2 text-center text-slate-400">Age</th>
                <th className="p-2 text-center text-slate-400">Income</th>
                <th className="p-2 text-center text-slate-400">Spending</th>
                <th className="p-2 text-center text-slate-400">Freq</th>
                <th className="p-2 text-center text-slate-400">Orders</th>
              </tr>
            </thead>
            <tbody>
              {correlationMatrix.map((row: any, idx: number) => (
                <tr key={idx} className="border-b border-slate-800">
                  <td className="p-2 font-medium text-slate-200">{row.feature}</td>
                  {['Age', 'Income', 'Spending', 'Frequency', 'Orders'].map((colKey, cIdx) => {
                    const val = row[colKey] ?? 0;
                    const intensity = Math.abs(val);
                    const bgCol = val >= 0.7 ? 'bg-blue-600/60 text-white' : val >= 0.4 ? 'bg-blue-500/30 text-blue-200' : val < 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400';
                    return (
                      <td key={cIdx} className={`p-2 text-center font-mono rounded ${bgCol}`}>
                        {val.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
