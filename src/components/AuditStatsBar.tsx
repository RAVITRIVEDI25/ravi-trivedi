import React from 'react';
import { CheckCircle2, XCircle, Clock, AlertTriangle, ListChecks } from 'lucide-react';
import { AuditProcedure } from '../types';

interface AuditStatsBarProps {
  procedures: AuditProcedure[];
  activeStatusFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const AuditStatsBar: React.FC<AuditStatsBarProps> = ({
  procedures,
  activeStatusFilter,
  onSelectFilter,
}) => {
  const total = procedures.length;
  const done = procedures.filter((p) => p.status === 'DONE').length;
  const na = procedures.filter((p) => p.status === 'NA').length;
  const pending = procedures.filter((p) => p.status === 'PENDING').length;
  const missingAssignees = procedures.filter(
    (p) => p.status === 'DONE' && (!p.performedBy || p.performedBy.trim() === '')
  ).length;

  const percentage = total > 0 ? Math.round(((done + na) / total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Progress bar info */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5">
              <ListChecks className="w-4 h-4 text-blue-800" />
              Audit Working Paper Progress
            </span>
            <span className="text-blue-900 font-bold">{percentage}% Evaluated</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${(done / (total || 1)) * 100}%` }}
              className="bg-emerald-600 transition-all duration-300"
              title={`${done} Done`}
            />
            <div
              style={{ width: `${(na / (total || 1)) * 100}%` }}
              className="bg-slate-500 transition-all duration-300"
              title={`${na} NA`}
            />
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectFilter('ALL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeStatusFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>All ({total})</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectFilter('DONE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeStatusFilter === 'DONE'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Done ({done})</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectFilter('NA')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeStatusFilter === 'NA'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>NA ({na})</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectFilter('PENDING')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeStatusFilter === 'PENDING'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({pending})</span>
          </button>

          {missingAssignees > 0 && (
            <button
              type="button"
              onClick={() => onSelectFilter('NEEDS_ASSIGNEE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold animate-pulse transition-all ${
                activeStatusFilter === 'NEEDS_ASSIGNEE'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Needs Assignee ({missingAssignees})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
