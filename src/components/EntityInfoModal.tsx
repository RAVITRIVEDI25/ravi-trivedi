import React from 'react';
import { X, Building2, Calendar, FileCheck, Check } from 'lucide-react';
import { EntityInfo } from '../types';

interface EntityInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityInfo: EntityInfo;
  onUpdate: (info: EntityInfo) => void;
}

export const EntityInfoModal: React.FC<EntityInfoModalProps> = ({
  isOpen,
  onClose,
  entityInfo,
  onUpdate,
}) => {
  const [formData, setFormData] = React.useState<EntityInfo>(entityInfo);

  React.useEffect(() => {
    setFormData(entityInfo);
  }, [entityInfo]);

  if (!isOpen) return null;

  const handleChange = (field: keyof EntityInfo, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold">Audit Engagement & Entity Details</h3>
              <p className="text-xs text-slate-300">
                Populates Part A (Entity Information) and Part C (Sign-off) of the Word document
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave}>
          <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-sm">
            {/* Section 1: Entity Information */}
            <div>
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-200 mb-3">
                <Building2 className="w-4 h-4 text-blue-700" />
                1. Client / Entity Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Name of Entity *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.entityName}
                    onChange={(e) => handleChange('entityName', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Financial Year Under Audit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.financialYear}
                    onChange={(e) => handleChange('financialYear', e.target.value)}
                    placeholder="2025-2026"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Type of Entity
                  </label>
                  <input
                    type="text"
                    value={formData.entityType}
                    onChange={(e) => handleChange('entityType', e.target.value)}
                    placeholder="Private Limited / LLP / Trust / Firm"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    CIN / LLPIN / Reg. No
                  </label>
                  <input
                    type="text"
                    value={formData.cinLlpin}
                    onChange={(e) => handleChange('cinLlpin', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-700 focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Registered Address
                  </label>
                  <input
                    type="text"
                    value={formData.registeredAddress}
                    onChange={(e) => handleChange('registeredAddress', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">PAN / TAN</label>
                  <input
                    type="text"
                    value={formData.panTan}
                    onChange={(e) => handleChange('panTan', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Reporting Framework
                  </label>
                  <input
                    type="text"
                    value={formData.reportingFramework}
                    onChange={(e) => handleChange('reportingFramework', e.target.value)}
                    placeholder="Ind AS / AS / IGAAP"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-700 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Audit Firm & Engagement */}
            <div>
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-200 mb-3">
                <FileCheck className="w-4 h-4 text-blue-700" />
                2. Audit Firm & Dates
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Audit Firm Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.auditFirmName}
                    onChange={(e) => handleChange('auditFirmName', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Engagement Partner *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.engagementPartner}
                    onChange={(e) => handleChange('engagementPartner', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Audit Commencement Date
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfCommencement}
                    onChange={(e) => handleChange('dateOfCommencement', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Report Signing Date
                  </label>
                  <input
                    type="date"
                    value={formData.actualReportDate}
                    onChange={(e) => handleChange('actualReportDate', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-700 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Overall Conclusion & Sign-Off */}
            <div>
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-200 mb-3">
                <Calendar className="w-4 h-4 text-blue-700" />
                3. Part C — Conclusion & Sign-Off
              </h4>
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Overall Audit Conclusion
                  </label>
                  <select
                    value={formData.overallConclusion}
                    onChange={(e) => handleChange('overallConclusion', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-700 focus:outline-hidden bg-white"
                  >
                    <option value="Nothing adverse observed — Financial Statements give True & Fair view">
                      Nothing adverse observed — Financial Statements give True & Fair view (Unmodified Clean Opinion)
                    </option>
                    <option value="Modified Opinion — Refer Audit Report para">
                      Modified Opinion — Refer Audit Report
                    </option>
                    <option value="Qualified Opinion — Refer Audit Memo">
                      Qualified / Adverse / Disclaimer of Opinion
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Key Observations / Audit Memos Raised
                  </label>
                  <input
                    type="text"
                    value={formData.keyObservations}
                    onChange={(e) => handleChange('keyObservations', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-700 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Outstanding Items / Pending Documents
                  </label>
                  <input
                    type="text"
                    value={formData.outstandingItems}
                    onChange={(e) => handleChange('outstandingItems', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-700 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Details</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
