import React, { useEffect, useState } from 'react';
import { analyticsAPI, mlAPI } from '../services/api';
import { DashboardKPIs, SegmentProfile, AIInsight, MarketingSuggestion } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { ChartsSection } from '../components/dashboard/ChartsSection';
import { ClusterSummaryCard } from '../components/dashboard/ClusterSummaryCard';
import { AIInsightsCard } from '../components/dashboard/AIInsightsCard';
import { Users, UserCheck, DollarSign, CreditCard, RefreshCw, Activity, Award, HeartHandshake, Sparkles } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [clusters, setClusters] = useState<SegmentProfile[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [suggestions, setSuggestions] = useState<MarketingSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [summaryRes, chartRes, insightRes, clusterRes] = await Promise.all([
        analyticsAPI.getDashboardSummary(),
        analyticsAPI.getAnalyticsCharts(),
        analyticsAPI.getAIInsights(),
        mlAPI.getClusters()
      ]);

      if (summaryRes.kpis) setKpis(summaryRes.kpis);
      if (chartRes) setAnalyticsData(chartRes);
      if (insightRes.insights) setInsights(insightRes.insights);
      if (insightRes.marketingSuggestions) setSuggestions(insightRes.marketingSuggestions);
      if (clusterRes.clusters) setClusters(clusterRes.clusters);
    } catch (e) {
      console.warn('Error loading dashboard datasets', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Customer Segmentation & Analytics</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
              K-Means Powered
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time customer clustering, lifetime value modeling, and automated retention recommendations
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all shrink-0 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={kpis?.totalCustomers?.toLocaleString() || '0'}
          change="+12.4%"
          icon={Users}
          subtitle="Processed customer rows"
          color="from-blue-600 to-indigo-600"
        />
        <StatCard
          title="Active Customers"
          value={kpis?.activeCustomers?.toLocaleString() || '0'}
          change="+8.1%"
          icon={UserCheck}
          subtitle="Non-churn risk profiles"
          color="from-emerald-600 to-teal-600"
        />
        <StatCard
          title="High Value Customers"
          value={kpis?.highValueCustomers?.toLocaleString() || '0'}
          change="+15.3%"
          icon={Award}
          subtitle="Premium tier spenders"
          color="from-purple-600 to-indigo-600"
        />
        <StatCard
          title="Avg Annual Spending"
          value={`$${kpis?.avgSpending?.toLocaleString() || '0'}`}
          change="+6.7%"
          icon={DollarSign}
          subtitle="Annual spend / customer"
          color="from-amber-600 to-orange-600"
        />

        <StatCard
          title="Average Income"
          value={`$${kpis?.avgIncome?.toLocaleString() || '0'}`}
          icon={CreditCard}
          subtitle="Household income mean"
          color="from-cyan-600 to-blue-600"
        />
        <StatCard
          title="Purchase Frequency"
          value={`${kpis?.avgFrequency || 0} / yr`}
          icon={Activity}
          subtitle="Average orders per year"
          color="from-rose-600 to-pink-600"
        />
        <StatCard
          title="Avg Customer Rating"
          value={`★ ${kpis?.avgRating || 4.5}`}
          icon={HeartHandshake}
          subtitle="Satisfaction benchmark"
          color="from-yellow-600 to-amber-600"
        />
        <StatCard
          title="Avg Lifetime Value (CLV)"
          value={`$${kpis?.avgCLV?.toLocaleString() || '0'}`}
          change="+18.9%"
          icon={Sparkles}
          subtitle="Model projected LTV"
          color="from-indigo-600 to-violet-600"
        />
      </div>

      {/* Cluster Persona Profiles Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white tracking-tight">K-Means Customer Segments</h2>
          <span className="text-xs text-slate-400 font-medium">StandardScaler + Silhouette Optimal K</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {clusters.slice(0, 4).map((cls) => (
            <ClusterSummaryCard key={cls.cluster_id} cluster={cls} />
          ))}
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight mb-4">Visual Customer Analytics</h2>
        <ChartsSection analyticsData={analyticsData} />
      </div>

      {/* AI Business Insights & Campaigns */}
      <AIInsightsCard insights={insights} suggestions={suggestions} />
    </div>
  );
};
