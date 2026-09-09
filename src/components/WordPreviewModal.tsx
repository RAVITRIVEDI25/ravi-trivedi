import React from 'react';
import { X, Download, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { AuditProcedure, EntityInfo } from '../types';
import { formatDoneRemarks, formatNaRemarks } from '../utils/docxGenerator';

interface WordPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityInfo: EntityInfo;
  procedures: AuditProcedure[];
  teamMembers: string[];
  onDownload: () => void;
}

export const WordPreviewModal: React.FC<WordPreviewModalProps> = ({
  isOpen,
  onClose,
  entityInfo,
  procedures,
  teamMembers,
  onDownload,
}) => {
  if (!isOpen) return null;

  const doneCount = procedures.filter((p) => p.status === 'DONE').length;
  const naCount = procedures.filter((p) => p.status === 'NA').length;
  const pendingCount = procedures.filter((p) => p.status === 'PENDING').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-300 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Preview Top Action Bar */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold">Word Document Layout Preview (.docx)</h3>
              <p className="text-xs text-slate-300">
                Exact structure, professional table formatting, and formatted remarks as per ICAI working paper template
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Word (.docx)</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Word Document Mock Sheet */}
        <div className="p-6 sm:p-8 max-h-[78vh] overflow-y-auto bg-slate-100/70 font-sans text-slate-800">
          {/* Simulated White Page */}
          <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-lg shadow-md border border-slate-200">
            {/* Header rule */}
            <div className="flex items-center justify-between border-b-2 border-blue-900 pb-2 mb-6">
              <span className="text-xs font-bold text-blue-950 tracking-wider">
                {entityInfo.auditFirmName.toUpperCase()} — AUDIT WORKING PAPER
              </span>
              <span className="text-xs font-bold text-rose-700 tracking-wider">
                CONFIDENTIAL
              </span>
            </div>

            {/* Document Title */}
            <div className="text-center my-6">
              <h1 className="text-2xl font-bold text-blue-950 tracking-wide">
                AUDIT WORKING PAPER TEMPLATE
              </h1>
              <h2 className="text-base font-bold text-blue-800 mt-1">
                {entityInfo.auditFirmName}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Covers: Companies (Ind AS & AS/IGAAP) | LLP / Partnership | Trust / NGO
                <br />
                Prepared as per ICAI Guidance | AICA Best Practices | SAs 300–720
              </p>
            </div>

            {/* PART A: ENTITY INFORMATION */}
            <div className="mt-8 mb-6">
              <div className="bg-blue-950 text-white px-3 py-1.5 text-xs font-bold tracking-wide rounded-t">
                PART A — ENTITY INFORMATION & ENGAGEMENT DETAILS
              </div>
              <div className="border border-slate-300 border-t-0 text-xs">
                <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-200">
                  <div className="p-2 bg-slate-50 font-semibold text-slate-700">Name of Entity</div>
                  <div className="p-2 font-medium">{entityInfo.entityName}</div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-200">
                  <div className="p-2 bg-slate-50 font-semibold text-slate-700">Financial Year</div>
                  <div className="p-2">{entityInfo.financialYear}</div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-200">
                  <div className="p-2 bg-slate-50 font-semibold text-slate-700">Audit Type & Framework</div>
                  <div className="p-2">{entityInfo.auditType} — {entityInfo.reportingFramework}</div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-300 border-b border-slate-200">
                  <div className="p-2 bg-slate-50 font-semibold text-slate-700">Audit Team Members</div>
                  <div className="p-2">{teamMembers.join(', ') || 'None entered'}</div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-300">
                  <div className="p-2 bg-slate-50 font-semibold text-slate-700">Engagement Partner</div>
                  <div className="p-2 font-medium">{entityInfo.engagementPartner}</div>
                </div>
              </div>
            </div>

            {/* Summary metrics */}
            <div className="flex gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs mb-8">
              <span className="font-semibold text-slate-700">Checklist Summary:</span>
              <span className="text-emerald-800 font-bold">{doneCount} Done</span>
              <span className="text-slate-600 font-bold">{naCount} NA</span>
              <span className="text-amber-700 font-bold">{pendingCount} Pending</span>
            </div>

            {/* PART B: PROCEDURES CHECKLIST TABLE */}
            <div className="my-6">
              <div className="bg-blue-950 text-white px-3 py-1.5 text-xs font-bold tracking-wide rounded-t">
                PART B — AUDIT PROCEDURES CHECKLIST
              </div>

              {/* Table Preview */}
              <div className="border border-slate-300 border-t-0 overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-200/80 text-slate-800 border-b border-slate-300 text-left">
                      <th className="p-2.5 w-12 text-center border-r border-slate-300 font-bold">S.No</th>
                      <th className="p-2.5 border-r border-slate-300 font-bold">Audit Procedure</th>
                      <th className="p-2.5 w-20 text-center border-r border-slate-300 font-bold">Status</th>
                      <th className="p-2.5 w-36 border-r border-slate-300 font-bold">Performed By</th>
                      <th className="p-2.5 w-72 font-bold">Remarks / Findings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {procedures.map((proc, idx) => {
                      const isDone = proc.status === 'DONE';
                      const isNA = proc.status === 'NA';
                      const remark =
                        isDone
                          ? formatDoneRemarks(proc.performedBy || 'Staff', proc.procedure)
                          : isNA
                          ? formatNaRemarks()
                          : 'Pending Review';

                      return (
                        <tr key={proc.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                          <td className="p-2 text-center border-r border-slate-300 font-medium text-slate-600">
                            {idx + 1}
                          </td>
                          <td className="p-2 border-r border-slate-300 text-slate-900 font-medium leading-relaxed">
                            <span className="text-[10px] text-blue-800 block font-semibold">
                              {proc.category}
                            </span>
                            {proc.procedure}
                          </td>
                          <td className="p-2 text-center border-r border-slate-300">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isDone
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isNA
                                  ? 'bg-slate-200 text-slate-700'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {isDone ? 'DONE' : isNA ? 'NA' : 'PENDING'}
                            </span>
                          </td>
                          <td className="p-2 border-r border-slate-300 font-medium text-slate-800">
                            {isDone ? proc.performedBy || 'Not assigned' : 'N/A'}
                          </td>
                          <td className="p-2 text-slate-700 leading-snug">
                            {remark}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PART C: CONCLUSION & SIGN-OFF */}
            <div className="mt-8">
              <div className="bg-blue-950 text-white px-3 py-1.5 text-xs font-bold tracking-wide rounded-t">
                PART C — OVERALL CONCLUSION & SIGN-OFF
              </div>
              <div className="border border-slate-300 border-t-0 text-xs divide-y divide-slate-200">
                <div className="grid grid-cols-3 divide-x divide-slate-300">
                  <div className="p-2.5 bg-slate-50 font-semibold text-slate-700">Overall Audit Conclusion</div>
                  <div className="p-2.5 col-span-2 font-medium text-emerald-900 bg-emerald-50/30">
                    {entityInfo.overallConclusion}
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-slate-300">
                  <div className="p-2.5 bg-slate-50 font-semibold text-slate-700">Key Observations</div>
                  <div className="p-2.5 col-span-2">{entityInfo.keyObservations}</div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-slate-300">
                  <div className="p-2.5 bg-slate-50 font-semibold text-slate-700">Sign-Off & Approval</div>
                  <div className="p-2.5 col-span-2">
                    Approved by {entityInfo.approvedBy} on {entityInfo.signOffDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer rule */}
            <div className="flex items-center justify-between border-t border-slate-300 pt-3 mt-8 text-[11px] text-slate-500">
              <span>For Internal Audit Use Only — Do Not Circulate</span>
              <span>Generated in compliance with ICAI Guidance & SAs 300–720</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Close Preview
          </button>
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate & Download Word File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
