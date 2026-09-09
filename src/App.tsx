import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Filter,
  CheckCheck,
  Building,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { AuditGroup, AuditProcedure, EntityInfo } from './types';
import { INITIAL_PROCEDURES, INITIAL_ENTITY_INFO } from './data/initialProcedures';
import { generateWorkingPaperDocx } from './utils/docxGenerator';
import { Header } from './components/Header';
import { AuditDashboard } from './components/AuditDashboard';
import { TeamMembersInput } from './components/TeamMembersInput';
import { AuditStatsBar } from './components/AuditStatsBar';
import { ProcedureItem } from './components/ProcedureItem';
import { ValidationModal } from './components/ValidationModal';
import { EntityInfoModal } from './components/EntityInfoModal';
import { WordPreviewModal } from './components/WordPreviewModal';

const AUDIT_GROUPS: { key: AuditGroup | 'ALL'; label: string; countGroup?: AuditGroup }[] = [
  { key: 'ALL', label: 'All Procedures' },
  { key: 'balance_sheet', label: 'Balance Sheet' },
  { key: 'profit_and_loss', label: 'Profit and Loss' },
  { key: 'compliance', label: 'Compliance & CARO' },
  { key: 'other_areas', label: 'Other Audit Areas' },
];

export default function App() {
  // State for team members input as requested by user
  const [teamMembersInput, setTeamMembersInput] = useState<string>(
    'Mr Amit Sharma, Ms Riya Gupta, CA Neha Das'
  );

  // State for audit procedures
  const [procedures, setProcedures] = useState<AuditProcedure[]>(INITIAL_PROCEDURES);

  // State for entity and engagement details
  const [entityInfo, setEntityInfo] = useState<EntityInfo>(INITIAL_ENTITY_INFO);

  // View state: 'dashboard' or 'checklist'
  const [activeView, setActiveView] = useState<'dashboard' | 'checklist'>('dashboard');

  // Active filters and search
  const [selectedGroup, setSelectedGroup] = useState<AuditGroup | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isValidationModalOpen, setIsValidationModalOpen] = useState<boolean>(false);
  const [isEntityModalOpen, setIsEntityModalOpen] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // Parse team members from comma-separated input
  const parsedTeamMembers = useMemo(() => {
    return teamMembersInput
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  }, [teamMembersInput]);

  // Find procedures marked as Done but missing an assignee
  const unassignedDoneProcedures = useMemo(() => {
    return procedures.filter(
      (p) => p.status === 'DONE' && (!p.performedBy || p.performedBy.trim() === '')
    );
  }, [procedures]);

  // Navigate to group from dashboard
  const handleNavigateToGroup = (group: AuditGroup | 'ALL', status?: string) => {
    setSelectedGroup(group);
    if (status) {
      setStatusFilter(status);
    } else {
      setStatusFilter('ALL');
    }
    setActiveView('checklist');
  };

  // Update status for a specific procedure
  const handleStatusChange = (id: string, newStatus: 'DONE' | 'NA' | 'PENDING') => {
    setProcedures((prev) =>
      prev.map((proc) => {
        if (proc.id !== id) return proc;
        return {
          ...proc,
          status: newStatus,
          // If changed to NA or PENDING, clear assignee
          performedBy: newStatus === 'DONE' ? proc.performedBy || '' : undefined,
        };
      })
    );
  };

  // Update assignee for a Done procedure
  const handleAssigneeChange = (id: string, member: string) => {
    setProcedures((prev) =>
      prev.map((proc) => {
        if (proc.id !== id) return proc;
        return { ...proc, performedBy: member };
      })
    );
  };

  // Bulk assign all unassigned to a specific member
  const handleAssignAllUnassigned = (member: string) => {
    if (!member) return;
    setProcedures((prev) =>
      prev.map((proc) => {
        if (proc.status === 'DONE' && (!proc.performedBy || proc.performedBy.trim() === '')) {
          return { ...proc, performedBy: member };
        }
        return proc;
      })
    );
    setIsValidationModalOpen(false);
  };

  // Jump to a specific procedure
  const handleJumpToProcedure = (id: string) => {
    setActiveView('checklist');
    setSelectedGroup('ALL');
    setStatusFilter('ALL');
    setTimeout(() => {
      const el = document.getElementById(`procedure-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-rose-500');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-rose-500');
        }, 2000);
      }
    }, 150);
  };

  // Bulk set visible procedures
  const handleBulkSetStatus = (status: 'DONE' | 'NA') => {
    const firstMember = parsedTeamMembers[0] || '';
    setProcedures((prev) =>
      prev.map((proc) => {
        // Only modify if matches current group
        if (selectedGroup !== 'ALL' && proc.group !== selectedGroup) return proc;
        return {
          ...proc,
          status,
          performedBy: status === 'DONE' ? proc.performedBy || firstMember : undefined,
        };
      })
    );
  };

  // Load a complete sample audit state
  const handleLoadSampleAudit = () => {
    const team = ['Mr Amit Sharma', 'Ms Riya Gupta', 'CA Neha Das'];
    setTeamMembersInput(team.join(', '));

    setProcedures((prev) =>
      prev.map((proc, idx) => {
        // Mark first 65% as Done with round-robin team members, 25% as NA, 10% Pending
        const mod = idx % 10;
        if (mod < 7) {
          const assignedMember = team[idx % team.length];
          return {
            ...proc,
            status: 'DONE',
            performedBy: assignedMember,
          };
        } else if (mod < 9) {
          return {
            ...proc,
            status: 'NA',
            performedBy: undefined,
          };
        } else {
          return {
            ...proc,
            status: 'PENDING',
            performedBy: undefined,
          };
        }
      })
    );

    setExportSuccessMessage('Sample audit data loaded! You can now review or export to Word.');
    setTimeout(() => setExportSuccessMessage(null), 5000);
  };

  // Export to Word document (.docx)
  const handleGenerateWord = async () => {
    // CRITICAL REQUIREMENT:
    // "If a procedure is marked Done but no team member is selected, do not generate the Word file.
    // Show a message asking the user to select the person who performed the work."
    if (unassignedDoneProcedures.length > 0) {
      setIsValidationModalOpen(true);
      return;
    }

    try {
      setIsGenerating(true);
      await generateWorkingPaperDocx(entityInfo, procedures, parsedTeamMembers);
      setExportSuccessMessage(
        `Working Paper successfully generated and downloaded for ${entityInfo.entityName}!`
      );
      setTimeout(() => setExportSuccessMessage(null), 6000);
    } catch (err) {
      console.error('Failed to generate Word document:', err);
      alert('An error occurred while creating the Word document. Please check console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Filtered procedures list
  const filteredProcedures = useMemo(() => {
    return procedures.filter((proc) => {
      // Group filter
      if (selectedGroup !== 'ALL' && proc.group !== selectedGroup) return false;

      // Status filter
      if (statusFilter === 'DONE' && proc.status !== 'DONE') return false;
      if (statusFilter === 'NA' && proc.status !== 'NA') return false;
      if (statusFilter === 'PENDING' && proc.status !== 'PENDING') return false;
      if (
        statusFilter === 'NEEDS_ASSIGNEE' &&
        !(proc.status === 'DONE' && (!proc.performedBy || proc.performedBy.trim() === ''))
      ) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = proc.procedure.toLowerCase().includes(query);
        const matchesCategory = proc.category.toLowerCase().includes(query);
        const matchesAssignee = proc.performedBy?.toLowerCase().includes(query);
        if (!matchesText && !matchesCategory && !matchesAssignee) return false;
      }

      return true;
    });
  }, [procedures, selectedGroup, statusFilter, searchQuery]);

  // Group filtered procedures by category for clean sectioning
  const groupedByCategory = useMemo<Record<string, AuditProcedure[]>>(() => {
    const groups: Record<string, AuditProcedure[]> = {};
    filteredProcedures.forEach((proc) => {
      if (!groups[proc.category]) {
        groups[proc.category] = [];
      }
      groups[proc.category].push(proc);
    });
    return groups;
  }, [filteredProcedures]);

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        entityInfo={entityInfo}
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenEntityModal={() => setIsEntityModalOpen(true)}
        onOpenPreviewModal={() => setIsPreviewModalOpen(true)}
        onGenerateDocx={handleGenerateWord}
        onLoadSampleData={handleLoadSampleAudit}
        missingAssigneeCount={unassignedDoneProcedures.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Success Alert Banner */}
        {exportSuccessMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>{exportSuccessMessage}</span>
            </div>
            <button
              onClick={() => setExportSuccessMessage(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold px-2 py-1 rounded"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Validation Warning Notice if any Done procedures lack an assignee */}
        {unassignedDoneProcedures.length > 0 && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 shrink-0 mt-0.5 sm:mt-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-900">
                  {unassignedDoneProcedures.length} Procedure
                  {unassignedDoneProcedures.length > 1 ? 's' : ''} marked as Done without an assigned team member
                </h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  Word file generation will be paused until you select which team member performed the work.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setStatusFilter('NEEDS_ASSIGNEE')}
                className="px-3 py-1.5 text-xs font-semibold text-rose-800 bg-white border border-rose-300 hover:bg-rose-50 rounded-lg transition-colors"
              >
                View Missing
              </button>
              <button
                onClick={() => setIsValidationModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-xs transition-colors"
              >
                Resolve Now
              </button>
            </div>
          </div>
        )}

        {/* 1. Team Members Box Component (Primary requirement) */}
        <TeamMembersInput
          rawInput={teamMembersInput}
          onInputChange={setTeamMembersInput}
          parsedMembers={parsedTeamMembers}
        />

        {/* VIEW 1: COLOURFUL GUI DASHBOARD */}
        {activeView === 'dashboard' ? (
          <AuditDashboard
            procedures={procedures}
            entityInfo={entityInfo}
            teamMembers={parsedTeamMembers}
            onNavigateToGroup={handleNavigateToGroup}
            onJumpToProcedure={handleJumpToProcedure}
            onGenerateWord={handleGenerateWord}
            onOpenEntityModal={() => setIsEntityModalOpen(true)}
            onStatusChange={handleStatusChange}
            onAssigneeChange={handleAssigneeChange}
          />
        ) : (
          /* VIEW 2: WORKING PAPER CHECKLIST TABLE */
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* 2. Audit Progress & Status Filter Bar */}
            <AuditStatsBar
              procedures={procedures}
              activeStatusFilter={statusFilter}
              onSelectFilter={setStatusFilter}
            />

        {/* 3. Navigation Tabs, Search & Bulk Actions Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          {/* Audit Group Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {AUDIT_GROUPS.map((tab) => {
              const count =
                tab.key === 'ALL'
                  ? procedures.length
                  : procedures.filter((p) => p.group === tab.key).length;

              const isSelected = selectedGroup === tab.key;

              return (
                <button
                  key={tab.key}
                  id={`tab-${tab.key}`}
                  onClick={() => setSelectedGroup(tab.key)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar & Section quick actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="search-procedures"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search procedures by title, category, or assignee..."
                className="w-full pl-9 pr-3.5 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800 focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Bulk helper buttons for the visible group */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden lg:inline">Quick section actions:</span>
              <button
                type="button"
                onClick={() => handleBulkSetStatus('DONE')}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
                title="Mark all procedures currently shown as Done"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark Group Done</span>
              </button>

              <button
                type="button"
                onClick={() => handleBulkSetStatus('NA')}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors"
                title="Mark all procedures currently shown as NA"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Mark Group NA</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Procedures Checklist List */}
        <div className="space-y-6">
          {Object.keys(groupedByCategory).length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">No procedures found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No audit procedures match your current search query or filter criteria. Try clearing
                the search or selecting a different status filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setSelectedGroup('ALL');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-blue-800 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            Object.keys(groupedByCategory).map((category) => {
              const items = groupedByCategory[category];
              const catDone = items.filter((p) => p.status === 'DONE').length;
              const catNA = items.filter((p) => p.status === 'NA').length;
              const catPending = items.filter((p) => p.status === 'PENDING').length;

              return (
                <div
                  key={category}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
                >
                  {/* Category Header Banner */}
                  <div className="bg-slate-900 text-white px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <h3 className="text-sm font-bold tracking-wide">{category}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-300">
                      <span>{items.length} procedures</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{catDone} Done</span>
                      <span>•</span>
                      <span className="text-slate-300 font-semibold">{catNA} NA</span>
                      {catPending > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400 font-semibold">
                            {catPending} Pending
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Procedures list for category */}
                  <div className="p-4 space-y-3">
                    {items.map((proc, idx) => (
                      <ProcedureItem
                        key={proc.id}
                        procedure={proc}
                        teamMembers={parsedTeamMembers}
                        onStatusChange={handleStatusChange}
                        onAssigneeChange={handleAssigneeChange}
                        index={idx}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Floating/Sticky Action Bar for Quick Export */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-800">Ready to export?</span>
            <p className="text-xs text-slate-500">
              Generating the Word file will produce an ICAI-formatted working paper with full remarks, team assignments, and sign-offs.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
            >
              Preview Document
            </button>
            <button
              type="button"
              onClick={handleGenerateWord}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating File...' : 'Generate Word File (.docx)'}</span>
            </button>
          </div>
        </div>
      </div>
    )}
  </main>

      {/* Validation Modal (Blocks Word generation if Done procedure has no team member) */}
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        unassignedProcedures={unassignedDoneProcedures}
        teamMembers={parsedTeamMembers}
        onAssignAll={handleAssignAllUnassigned}
        onJumpToProcedure={handleJumpToProcedure}
      />

      {/* Entity and Engagement Details Modal */}
      <EntityInfoModal
        isOpen={isEntityModalOpen}
        onClose={() => setIsEntityModalOpen(false)}
        entityInfo={entityInfo}
        onUpdate={setEntityInfo}
      />

      {/* Word Layout Preview Modal */}
      <WordPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        entityInfo={entityInfo}
        procedures={procedures}
        teamMembers={parsedTeamMembers}
        onDownload={handleGenerateWord}
      />
    </div>
  );
}
