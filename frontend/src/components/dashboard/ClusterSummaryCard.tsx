import React from 'react';
import { SegmentProfile } from '../../types';
import { Target, Users, TrendingUp } from 'lucide-react';

interface ClusterSummaryCardProps {
  cluster: SegmentProfile;
  onSelectCluster?: (clusterId: number) => void;
}

export const ClusterSummaryCard: React.FC<ClusterSummaryCardProps> = ({ cluster, onSelectCluster }) => {
  return (
    <div
      onClick={() => onSelectCluster && onSelectCluster(cluster.cluster_id)}
      className="glass-card p-5 cursor-pointer group hover:-translate-y-1 transition-all duration-200 border-l-4"
      style={{ borderLeftColor: cluster.color }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm"
          style={{ backgroundColor: cluster.color }}
        >
          {cluster.badge || `Cluster ${cluster.cluster_id}`}
        </span>
        <div className="flex items-center space-x-1 text-slate-400 text-xs font-medium">
          <Users className="w-3.5 h-3.5" />
          <span>{cluster.count ?? 0} ({cluster.percentage ?? 0}%)</span>
        </div>
      </div>

      <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
        {cluster.name}
      </h4>

      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
        {cluster.description}
      </p>

      {/* Cluster Feature Averages Grid */}
      {cluster.averages && (
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 mb-4">
          <div>
            <span className="text-slate-500 block">Avg Income</span>
            <span className="font-semibold text-slate-200">${cluster.averages.Income?.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Avg Spend</span>
            <span className="font-semibold text-slate-200">${cluster.averages['Annual Spending']?.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Purchase Freq</span>
            <span className="font-semibold text-slate-200">{cluster.averages['Purchase Frequency']} / yr</span>
          </div>
          <div>
            <span className="text-slate-500 block">Avg Orders</span>
            <span className="font-semibold text-slate-200">{cluster.averages['Number of Orders']} orders</span>
          </div>
        </div>
      )}

      {/* Marketing Strategy Banner */}
      <div className="flex items-start space-x-2 text-xs text-indigo-300 bg-indigo-500/10 p-2.5 rounded-lg border border-indigo-500/20">
        <Target className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
        <span className="leading-tight">{cluster.strategy}</span>
      </div>
    </div>
  );
};
