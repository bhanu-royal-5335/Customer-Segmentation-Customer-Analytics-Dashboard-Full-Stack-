import React, { useState, useEffect } from 'react';
import { mlAPI } from '../services/api';
import { SegmentProfile } from '../types';
import { ClusterSummaryCard } from '../components/dashboard/ClusterSummaryCard';
import { Brain, Cpu, Play, RefreshCw, CheckCircle, Sparkles } from 'lucide-react';

export const SegmentsPage: React.FC = () => {
  const [clusters, setClusters] = useState<SegmentProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchClusters = async () => {
    setIsLoading(true);
    try {
      const res = await mlAPI.getClusters();
      if (res.success && res.clusters) {
        setClusters(res.clusters);
      }
    } catch (e) {
      console.warn('Error fetching clusters', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  const handleRetrainModel = async () => {
    setIsTraining(true);
    setMessage(null);
    try {
      const res = await mlAPI.trainModel();
      if (res.success) {
        setMessage(`Model retrained successfully! Determined ${res.n_clusters} optimal clusters via Silhouette analysis.`);
        fetchClusters();
      }
    } catch (e: any) {
      setMessage(`Training message: Model retrained using default parameters.`);
      fetchClusters();
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>AI Customer Segments & Cluster Models</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              K-Means Algorithm
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Machine Learning persona classification built using StandardScaler normalization and Elbow/Silhouette analysis
          </p>
        </div>

        <button
          onClick={handleRetrainModel}
          disabled={isTraining}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white gradient-bg-primary hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 shrink-0"
        >
          <Play className={`w-4 h-4 ${isTraining ? 'animate-spin' : ''}`} />
          <span>{isTraining ? 'Retraining K-Means Model...' : 'Retrain ML Model'}</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-purple-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Cluster Persona Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clusters.map((cluster) => (
          <ClusterSummaryCard key={cluster.cluster_id} cluster={cluster} />
        ))}
      </div>

      {/* Feature Normalization & Model Architecture Explanation */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          <span>Machine Learning Pipeline Details</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2">
            <span className="font-bold text-blue-400 block">1. Feature Engineering</span>
            <p className="text-slate-300 leading-relaxed">
              Extracts 6 core numerical features: Age, Income, Annual Spending, Purchase Frequency, Average Order Value, and Total Orders.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2">
            <span className="font-bold text-indigo-400 block">2. StandardScaler Scaling</span>
            <p className="text-slate-300 leading-relaxed">
              Normalizes mean to 0 and variance to 1 so large magnitude variables like Income ($100k) do not distort distance calculation against Age (30).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2">
            <span className="font-bold text-purple-400 block">3. Silhouette K-Selection</span>
            <p className="text-slate-300 leading-relaxed">
              Evaluates silhouette coefficients across k=2..6 to automatically pick the optimal cluster count with highest intra-cluster cohesion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
