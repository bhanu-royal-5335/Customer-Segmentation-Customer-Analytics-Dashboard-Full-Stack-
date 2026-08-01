import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, Users, PieChart, FileText, BrainCircuit } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard Overview', path: '/', icon: LayoutDashboard },
    { label: 'Dataset Upload', path: '/upload', icon: UploadCloud },
    { label: 'Customer Directory', path: '/customers', icon: Users },
    { label: 'AI Segmentation', path: '/segments', icon: PieChart },
    { label: 'Export Reports', path: '/reports', icon: FileText }
  ];

  return (
    <aside className="no-print w-64 border-r border-slate-700/60 bg-slate-900/90 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Main Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* AI Model Badge Box */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-blue-950/40 to-indigo-950/40 border border-blue-500/20 text-xs text-slate-300 space-y-2">
          <div className="flex items-center space-x-2 text-blue-400 font-semibold">
            <BrainCircuit className="w-4 h-4" />
            <span>K-Means ML Active</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            StandardScaler feature scaling & Silhouette optimal cluster detection enabled.
          </p>
        </div>
      </div>

      <div className="text-xs text-slate-500 text-center py-2 border-t border-slate-800">
        SegmentAI v1.0.0 • Full Stack
      </div>
    </aside>
  );
};
