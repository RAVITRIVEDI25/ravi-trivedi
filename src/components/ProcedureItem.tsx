import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, UserCheck, FileText, ChevronDown } from 'lucide-react';
import { AuditProcedure } from '../types';
import { formatDoneRemarks, formatNaRemarks } from '../utils/docxGenerator';

interface ProcedureItemProps {
  procedure: AuditProcedure;
  teamMembers: string[];
  onStatusChange: (id: string, status: 'DONE' | 'NA' | 'PENDING') => void;
  onAssigneeChange: (id: string, member: string) => void;
  onCustomRemarksChange?: (id: string, remarks: string) => void;
  index: number;
}

export const ProcedureItem: React.FC<ProcedureItemProps> = ({
  procedure,
  teamMembers,
  onStatusChange,
  onAssigneeChange,
  index,
}) => {
  const isDone = procedure.status === 'DONE';
  const isNA = procedure.status === 'NA';
  const isMissingAssignee = isDone && (!procedure.performedBy || procedure.performedBy.trim() === '');

  // Computed remarks display
  let liveRemarks = '';
  if (isDone) {
    if (procedure.performedBy && procedure.performedBy.trim()) {
      liveRemarks = formatDoneRemarks(procedure.performedBy, procedure.procedure);
    } else {
      liveRemarks = `[Select Member] did the work of ${procedure.procedure} and there was no adverse findings.`;
    }
  } else if (isNA) {
    liveRemarks = formatNaRemarks();
  }

  return (
    <div
      id={`procedure-${procedure.id}`}
      className={`p-4 rounded-lg border transition-all ${
        isMissingAssignee
          ? 'bg-rose-50/40 border-rose-300 ring-1 ring-rose-200'
          : isDone
          ? 'bg-emerald-50/20 border-emerald-200/80'
          : isNA
          ? 'bg-slate-50/60 border-slate-200 opacity-80'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
        {/* Left: Index & Procedure Text */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            {procedure.sNo || index + 1}
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900 leading-relaxed">
              {procedure.procedure}
            </p>

            {/* Generated remarks preview */}
            {(isDone || isNA) && (
              <div className="mt-2.5 flex items-start gap-2 text-xs bg-white/80 p-2.5 rounded-md border border-slate-200/70">
                <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                <div className="flex-1">
                  <span className="font-semibold text-slate-600 mr-1.5">Remarks for Word Doc:</span>
                  <span
                    className={
                      isMissingAssignee
                        ? 'text-rose-700 font-medium italic'
                        : isDone
                        ? 'text-slate-800'
                        : 'text-slate-600 italic'
                    }
                  >
                    {liveRemarks}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions & Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 lg:self-center">
          {/* Status Buttons: Done and NA */}
          <div className="inline-flex rounded-lg p-1 bg-slate-100 border border-slate-200/80">
            <button
              type="button"
              id={`btn-done-${procedure.id}`}
              onClick={() => onStatusChange(procedure.id, isDone ? 'PENDING' : 'DONE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                isDone
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>

            <button
              type="button"
              id={`btn-na-${procedure.id}`}
              onClick={() => onStatusChange(procedure.id, isNA ? 'PENDING' : 'NA')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                isNA
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>NA</span>
            </button>
          </div>

          {/* If Marked DONE: Dropdown to select which team member performed the work */}
          {isDone && (
            <div className="relative min-w-[200px]">
              <div className="relative">
                <select
                  id={`select-assignee-${procedure.id}`}
                  value={procedure.performedBy || ''}
                  onChange={(e) => onAssigneeChange(procedure.id, e.target.value)}
                  className={`w-full appearance-none pl-3 pr-8 py-1.5 text-xs rounded-md border font-medium focus:outline-hidden transition-colors ${
                    isMissingAssignee
                      ? 'border-rose-400 bg-rose-50/80 text-rose-800 ring-2 ring-rose-200 focus:ring-rose-400'
                      : 'border-emerald-300 bg-emerald-50/50 text-emerald-950 focus:ring-2 focus:ring-emerald-500'
                  }`}
                >
                  <option value="">-- Select Team Member --</option>
                  {teamMembers.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {isMissingAssignee && (
                <div className="absolute -bottom-4.5 left-0 flex items-center gap-1 text-[10px] text-rose-700 font-semibold tracking-tight">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  <span>Assignee required to export</span>
                </div>
              )}
            </div>
          )}

          {isNA && (
            <span className="text-[11px] text-slate-500 italic px-2 py-1 bg-slate-100/80 rounded border border-slate-200">
              No staff required
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
