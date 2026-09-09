import React from 'react';
import { AlertOctagon, X, UserCheck, ArrowRight } from 'lucide-react';
import { AuditProcedure } from '../types';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  unassignedProcedures: AuditProcedure[];
  teamMembers: string[];
  onAssignAll: (member: string) => void;
  onJumpToProcedure: (id: string) => void;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  onClose,
  unassignedProcedures,
  teamMembers,
  onAssignAll,
  onJumpToProcedure,
}) => {
  if (!isOpen || unassignedProcedures.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-rose-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-rose-50 px-6 py-5 border-b border-rose-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Action Required: Team Member Not Selected
              </h3>
              <p className="text-sm text-rose-700 mt-0.5">
                Cannot generate the Word file. Please select the person who performed the work for all procedures marked as Done.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {unassignedProcedures.length} {unassignedProcedures.length === 1 ? 'Procedure' : 'Procedures'} Needing Assignee
            </span>

            {/* Quick Bulk Assign Helper if team members exist */}
            {teamMembers.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Quick Assign All:</span>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      onAssignAll(e.target.value);
                    }
                  }}
                  defaultValue=""
                  className="text-xs px-2.5 py-1 rounded-md border border-slate-300 bg-slate-50 text-slate-800 font-medium focus:outline-hidden"
                >
                  <option value="" disabled>
                    Select member...
                  </option>
                  {teamMembers.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* List of unassigned items */}
          <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100">
            {unassignedProcedures.map((proc) => (
              <div
                key={proc.id}
                className="pt-2.5 flex items-start justify-between gap-3 text-sm group"
              >
                <div className="flex-1">
                  <span className="inline-block text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded mr-2">
                    {proc.category}
                  </span>
                  <p className="text-slate-800 mt-1 font-medium text-xs sm:text-sm">
                    {proc.procedure}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onJumpToProcedure(proc.id);
                  }}
                  className="shrink-0 flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-medium bg-blue-50/80 hover:bg-blue-100 px-2.5 py-1.5 rounded-md transition-colors"
                >
                  <span>Select</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {teamMembers.length === 0 && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
              Tip: You haven't added any team members yet. Add their names in the Audit Team Members box at the top (e.g. "Mr Amit Sharma, Ms Riya Gupta, CA Neha Das").
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Review Checklist
          </button>
        </div>
      </div>
    </div>
  );
};
