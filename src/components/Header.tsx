import React from 'react';
import { FileText, Download, Settings, Eye, RefreshCw, LayoutDashboard, ListChecks } from 'lucide-react';
import { EntityInfo } from '../types';

interface HeaderProps {
  entityInfo: EntityInfo;
  activeView: 'dashboard' | 'checklist';
  onViewChange: (view: 'dashboard' | 'checklist') => void;
  onOpenEntityModal: () => void;
  onOpenPreviewModal: () => void;
  onGenerateDocx: () => void;
  onLoadSampleData: () => void;
  missingAssigneeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  entityInfo,
  activeView,
  onViewChange,
  onOpenEntityModal,
  onOpenPreviewModal,
  onGenerateDocx,
  onLoadSampleData,
  missingAssigneeCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand & Client Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  Audit Working Paper
                </h1>
                <span className="text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded">
                  Word (.docx)
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate max-w-md">
                Client: <span className="font-semibold text-white">{entityInfo.entityName}</span> | FY {entityInfo.financialYear}
              </p>
            </div>
          </div>

          {/* View Switcher: Dashboard vs Checklist */}
          <div className="inline-flex rounded-xl p-1 bg-slate-800/90 border border-slate-700 self-start md:self-auto">
            <button
              type="button"
              id="view-dashboard-btn"
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-300" />
              <span>Audit Dashboard</span>
            </button>
            <button
              type="button"
              id="view-checklist-btn"
              onClick={() => onViewChange('checklist')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'checklist'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5 text-emerald-300" />
              <span>Working Paper Checklist</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2">
            <button
              type="button"
              id="btn-load-sample"
              onClick={onLoadSampleData}
              title="Populate sample audit data with assigned team members"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden xl:inline">Load Sample Audit</span>
              <span className="xl:hidden">Sample</span>
            </button>

            <button
              type="button"
              id="btn-edit-entity"
              onClick={onOpenEntityModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Entity</span>
            </button>

            <button
              type="button"
              id="btn-preview-word"
              onClick={onOpenPreviewModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              id="btn-generate-docx"
              onClick={onGenerateDocx}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 rounded-lg shadow-sm transition-all ring-1 ring-blue-400/40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Word</span>
              {missingAssigneeCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  !
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
