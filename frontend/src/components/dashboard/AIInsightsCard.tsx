import React from 'react';
import { AIInsight, MarketingSuggestion } from '../../types';
import { Brain, TrendingUp, Users, MapPin, AlertTriangle, ArrowRight, Zap } from 'lucide-react';

interface AIInsightsCardProps {
  insights: AIInsight[];
  suggestions: MarketingSuggestion[];
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ insights = [], suggestions = [] }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'Users': return <Users className="w-5 h-5 text-indigo-400" />;
      case 'MapPin': return <MapPin className="w-5 h-5 text-emerald-400" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default: return <Brain className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive AI Insights */}
      <div className="glass-card p-6 border-t-4 border-t-purple-500">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Automated Business Insights</h3>
            <p className="text-xs text-slate-400">Algorithmic findings generated from K-Means cluster analysis & spending behaviors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/60 hover:border-purple-500/40 transition-colors space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                  {getIcon(item.icon)}
                </div>
                <h4 className="font-semibold text-sm text-slate-100">{item.title}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.text}</p>
              <div className="text-xs text-purple-300 bg-purple-500/10 p-2.5 rounded-lg border border-purple-500/20 font-medium flex items-center justify-between">
                <span>Action: {item.recommendation}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Marketing Campaigns */}
      <div className="glass-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Segment-Specific Campaign Playbook</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Cluster Segment</th>
                <th className="py-2.5 px-3">Recommended Campaign Strategy</th>
                <th className="py-2.5 px-3">Target Channel</th>
                <th className="py-2.5 px-3 text-right">Expected Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {suggestions.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-200">{s.cluster}</td>
                  <td className="py-3 px-3 text-slate-300">{s.action}</td>
                  <td className="py-3 px-3 text-indigo-300">{s.channel}</td>
                  <td className="py-3 px-3 text-right font-medium text-emerald-400">{s.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
