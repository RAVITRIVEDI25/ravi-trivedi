import React from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Building2,
  Calendar,
  UserCheck,
  TrendingUp,
  FileCheck,
  ArrowRight,
  Download,
  CheckCheck,
  Sparkles,
  PieChart,
  ShieldCheck,
  Briefcase,
  Users,
} from 'lucide-react';
import { AuditGroup, AuditProcedure, EntityInfo } from '../types';

interface AuditDashboardProps {
  procedures: AuditProcedure[];
  entityInfo: EntityInfo;
  teamMembers: string[];
  onNavigateToGroup: (group: AuditGroup | 'ALL', statusFilter?: string) => void;
  onJumpToProcedure: (id: string) => void;
  onGenerateWord: () => void;
  onOpenEntityModal: () => void;
  onStatusChange: (id: string, newStatus: 'DONE' | 'NA' | 'PENDING') => void;
  onAssigneeChange: (id: string, member: string) => void;
}

const GROUP_CONFIG: Record<
  AuditGroup,
  {
    name: string;
    subtitle: string;
    badgeBg: string;
    badgeText: string;
    gradient: string;
    border: string;
    accentColor: string;
    lightBg: string;
  }
> = {
  balance_sheet: {
    name: 'Balance Sheet',
    subtitle: 'PPE, Inventories, Receivables, Cash & Liabilities',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    gradient: 'from-blue-600 to-cyan-600',
    border: 'border-blue-200',
    accentColor: '#2563eb',
    lightBg: 'bg-blue-50/50',
  },
  profit_and_loss: {
    name: 'Profit and Loss',
    subtitle: 'Revenue, Purchases, Employee Cost, Finance & Taxes',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    gradient: 'from-purple-600 to-indigo-600',
    border: 'border-purple-200',
    accentColor: '#9333ea',
    lightBg: 'bg-purple-50/50',
  },
  compliance: {
    name: 'Compliance & CARO',
    subtitle: 'CARO 2020 clauses, Schedule III & Statutory Dues',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    gradient: 'from-emerald-600 to-teal-600',
    border: 'border-emerald-200',
    accentColor: '#059669',
    lightBg: 'bg-emerald-50/50',
  },
  other_areas: {
    name: 'Other Audit Areas',
    subtitle: 'Related Parties, Contingencies & Going Concern',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    gradient: 'from-amber-500 to-orange-600',
    border: 'border-amber-200',
    accentColor: '#d97706',
    lightBg: 'bg-amber-50/50',
  },
};

const MEMBER_COLORS = [
  { bg: 'bg-indigo-500', text: 'text-indigo-900', border: 'border-indigo-200', badge: 'bg-indigo-50 text-indigo-700' },
  { bg: 'bg-emerald-500', text: 'text-emerald-900', border: 'border-emerald-200', badge: 'bg-emerald-50 text-emerald-700' },
  { bg: 'bg-purple-500', text: 'text-purple-900', border: 'border-purple-200', badge: 'bg-purple-50 text-purple-700' },
  { bg: 'bg-rose-500', text: 'text-rose-900', border: 'border-rose-200', badge: 'bg-rose-50 text-rose-700' },
  { bg: 'bg-amber-500', text: 'text-amber-900', border: 'border-amber-200', badge: 'bg-amber-50 text-amber-700' },
  { bg: 'bg-cyan-500', text: 'text-cyan-900', border: 'border-cyan-200', badge: 'bg-cyan-50 text-cyan-700' },
];

export const AuditDashboard: React.FC<AuditDashboardProps> = ({
  procedures,
  entityInfo,
  teamMembers,
  onNavigateToGroup,
  onJumpToProcedure,
  onGenerateWord,
  onOpenEntityModal,
  onStatusChange,
  onAssigneeChange,
}) => {
  const total = procedures.length;
  const done = procedures.filter((p) => p.status === 'DONE').length;
  const na = procedures.filter((p) => p.status === 'NA').length;
  const pending = procedures.filter((p) => p.status === 'PENDING').length;
  const missingAssignees = procedures.filter(
    (p) => p.status === 'DONE' && (!p.performedBy || p.performedBy.trim() === '')
  );

  const donePercent = total > 0 ? Math.round((done / total) * 100) : 0;
  const naPercent = total > 0 ? Math.round((na / total) * 100) : 0;
  const pendingPercent = total > 0 ? Math.round((pending / total) * 100) : 0;
  const evaluatedPercent = donePercent + naPercent;

  // Pending procedures list (top 8 for quick drilldown)
  const pendingProcedures = procedures.filter((p) => p.status === 'PENDING');

  // Breakdown by group
  const groupStats = (['balance_sheet', 'profit_and_loss', 'compliance', 'other_areas'] as AuditGroup[]).map(
    (groupKey) => {
      const items = procedures.filter((p) => p.group === groupKey);
      const groupDone = items.filter((p) => p.status === 'DONE').length;
      const groupNA = items.filter((p) => p.status === 'NA').length;
      const groupPending = items.filter((p) => p.status === 'PENDING').length;
      const groupMissing = items.filter(
        (p) => p.status === 'DONE' && (!p.performedBy || p.performedBy.trim() === '')
      ).length;
      const groupCompletedPercent =
        items.length > 0 ? Math.round(((groupDone + groupNA) / items.length) * 100) : 0;

      return {
        key: groupKey,
        ...GROUP_CONFIG[groupKey],
        total: items.length,
        done: groupDone,
        na: groupNA,
        pending: groupPending,
        missing: groupMissing,
        percent: groupCompletedPercent,
        pendingItems: items.filter((p) => p.status === 'PENDING'),
      };
    }
  );

  // Breakdown by team member
  const memberStats = teamMembers.map((member, idx) => {
    const assignedProcedures = procedures.filter((p) => p.performedBy === member && p.status === 'DONE');
    const color = MEMBER_COLORS[idx % MEMBER_COLORS.length];
    const percentageOfDone = done > 0 ? Math.round((assignedProcedures.length / done) * 100) : 0;

    return {
      name: member,
      count: assignedProcedures.length,
      percentage: percentageOfDone,
      color,
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Colourful Client Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 shadow-xl border border-blue-900/40">
        {/* Decorative background lights */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-400/40 tracking-wide uppercase">
                <Briefcase className="w-3.5 h-3.5" />
                Audit Engagement Status
              </span>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-xs ${
                  missingAssignees.length > 0
                    ? 'bg-rose-500 text-white'
                    : pending === 0
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-400 text-slate-900'
                }`}
              >
                {missingAssignees.length > 0
                  ? '⚠️ Blocker: Assignee Needed'
                  : pending === 0
                  ? '✓ All Audit Procedures Complete'
                  : `● Work in Progress (${pending} Pending)`}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>{entityInfo.entityName}</span>
            </h2>

            <p className="text-sm text-blue-200/90 max-w-2xl leading-relaxed">
              <span className="font-semibold text-white">FY {entityInfo.financialYear}</span> •{' '}
              {entityInfo.auditType} • Framework: {entityInfo.reportingFramework} • Firm:{' '}
              {entityInfo.auditFirmName}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-blue-200/80">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Target Report Date: <strong className="text-white">{entityInfo.targetReportDate}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Engagement Partner: <strong className="text-white">{entityInfo.engagementPartner}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                Audit Team: <strong className="text-white">{teamMembers.length} active</strong>
              </span>
            </div>
          </div>

          {/* Quick Action buttons on Client Card */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenEntityModal}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs transition-all"
            >
              Edit Client Info
            </button>
            <button
              type="button"
              onClick={onGenerateWord}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Export Word (.docx)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Four Vibrant Top-Level Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Procedures */}
        <div
          onClick={() => onNavigateToGroup('ALL', 'ALL')}
          className="cursor-pointer group relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Checklist Scope
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{total}</span>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              4 Audit Areas
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span>Overall Evaluation:</span>
            <strong className="text-blue-900">{evaluatedPercent}% Complete</strong>
          </p>
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
              style={{ width: `${evaluatedPercent}%` }}
            />
          </div>
        </div>

        {/* Card 2: Work Completed (Done) */}
        <div
          onClick={() => onNavigateToGroup('ALL', 'DONE')}
          className="cursor-pointer group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/5 via-white to-emerald-500/10 p-5 border border-emerald-200/90 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Client Work Done
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-900">{done}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              {donePercent}% of audit
            </span>
          </div>
          <p className="text-xs text-emerald-800/90 mt-2 font-medium">
            Remarks generated with no adverse findings
          </p>
          <div className="mt-3 w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${donePercent}%` }}
            />
          </div>
        </div>

        {/* Card 3: Work Pending */}
        <div
          onClick={() => onNavigateToGroup('ALL', 'PENDING')}
          className="cursor-pointer group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/5 via-white to-amber-500/10 p-5 border border-amber-200/90 shadow-xs hover:shadow-md hover:border-amber-400 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Client Work Pending
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-900">{pending}</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              {pendingPercent}% remaining
            </span>
          </div>
          <p className="text-xs text-amber-800/90 mt-2 font-medium">
            {pending > 0 ? 'Requires procedure execution' : 'All items evaluated!'}
          </p>
          <div className="mt-3 w-full bg-amber-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${pendingPercent}%` }}
            />
          </div>
        </div>

        {/* Card 4: Not Applicable / Excluded Scope */}
        <div
          onClick={() => onNavigateToGroup('ALL', 'NA')}
          className="cursor-pointer group relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Not Applicable (NA)
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-purple-500/20 group-hover:scale-110 transition-transform">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800">{na}</span>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              {naPercent}% out of scope
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Excluded with formal engagement justification
          </p>
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${naPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Area Breakdown (Colourful visual cards) & Audit Team Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Audit Group Progress Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-700" />
                Client Work by Audit Area
              </h3>
              <p className="text-xs text-slate-500">
                Detailed Done vs. Pending progress across statutory audit sections
              </p>
            </div>
            <button
              onClick={() => onNavigateToGroup('ALL')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>View full checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groupStats.map((grp) => (
              <div
                key={grp.key}
                className={`rounded-2xl border ${grp.border} ${grp.lightBg} p-5 shadow-xs transition-all hover:shadow-md bg-white`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide ${grp.badgeBg} ${grp.badgeText} mb-1`}
                    >
                      {grp.name}
                    </span>
                    <p className="text-xs text-slate-500 leading-snug line-clamp-1">{grp.subtitle}</p>
                  </div>
                  <span className="text-lg font-extrabold text-slate-900">{grp.percent}%</span>
                </div>

                {/* Multicolored Progress Bar */}
                <div className="my-3">
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      style={{ width: `${(grp.done / (grp.total || 1)) * 100}%` }}
                      className="bg-emerald-500 transition-all duration-300"
                      title={`${grp.done} Done`}
                    />
                    <div
                      style={{ width: `${(grp.na / (grp.total || 1)) * 100}%` }}
                      className="bg-purple-400 transition-all duration-300"
                      title={`${grp.na} NA`}
                    />
                    <div
                      style={{ width: `${(grp.pending / (grp.total || 1)) * 100}%` }}
                      className="bg-amber-400 transition-all duration-300"
                      title={`${grp.pending} Pending`}
                    />
                  </div>
                </div>

                {/* Metrics Breakdown Chips */}
                <div className="flex items-center justify-between text-xs pt-1 text-slate-600 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {grp.done} Done
                  </span>
                  <span className="flex items-center gap-1 text-amber-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {grp.pending} Pending
                  </span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <XCircle className="w-3.5 h-3.5 text-slate-400" />
                    {grp.na} NA
                  </span>
                </div>

                {/* Quick filter action */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {grp.pending === 0 ? '✓ No pending items' : `${grp.pending} items awaiting action`}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateToGroup(grp.key, grp.pending > 0 ? 'PENDING' : 'ALL')}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>{grp.pending > 0 ? 'Work on Pending' : 'Review Area'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Column: Team Contribution & Readiness Checklist */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Audit Team Workload
              </h3>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {done} Completed
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Breakdown of audit procedures executed by team members
            </p>

            <div className="space-y-3">
              {memberStats.length > 0 ? (
                memberStats.map((member) => (
                  <div key={member.name} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${member.color.bg}`} />
                        <span className="font-bold text-slate-800">{member.name}</span>
                      </div>
                      <span className="font-semibold text-slate-700">
                        {member.count} procedures ({member.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${member.color.bg}`}
                        style={{ width: `${member.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 text-amber-800 text-xs border border-amber-200 text-center">
                  No team members entered yet. Enter member names above!
                </div>
              )}
            </div>
          </div>

          {/* Word Export Readiness Checklist */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-5 shadow-md">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-2 text-white">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              Word Working Paper Readiness
            </h3>
            <p className="text-xs text-blue-200 mb-4">
              Pre-export verification against ICAI guidelines & assignment mandates
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-lg">
                <span className="text-blue-100">Audit Team Specified:</span>
                <span className={teamMembers.length > 0 ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                  {teamMembers.length > 0 ? `✓ Yes (${teamMembers.length})` : '✗ Missing'}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-lg">
                <span className="text-blue-100">All Done Assigned:</span>
                <span className={missingAssignees.length === 0 ? 'text-emerald-300 font-bold' : 'text-rose-400 font-bold'}>
                  {missingAssignees.length === 0 ? '✓ Ready' : `✗ ${missingAssignees.length} Missing Staff`}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white/10 p-2.5 rounded-lg">
                <span className="text-blue-100">Procedures Evaluated:</span>
                <span className="text-cyan-300 font-bold">
                  {done + na} of {total} ({evaluatedPercent}%)
                </span>
              </div>
            </div>

            <button
              onClick={onGenerateWord}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-blue-50 rounded-xl shadow transition-colors"
            >
              <Download className="w-4 h-4 text-blue-900" />
              <span>Generate & Download Word File</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Client Pending Work Table Drilldown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Client Pending Work Items ({pendingProcedures.length})
            </h3>
            <p className="text-xs text-slate-500">
              Audit procedures remaining to be executed and verified before working paper closure
            </p>
          </div>
          {pendingProcedures.length > 0 && (
            <button
              onClick={() => onNavigateToGroup('ALL', 'PENDING')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 self-start sm:self-auto bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span>View All Pending in Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {pendingProcedures.length === 0 ? (
          <div className="p-8 text-center bg-emerald-50/50 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-emerald-900">All Client Work Evaluated!</h4>
            <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">
              Every audit procedure has been marked as either Done or NA. You are ready to generate the complete audit working paper in Word format.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="p-3 w-12 text-center">#</th>
                  <th className="p-3 w-40">Audit Area / Category</th>
                  <th className="p-3">Pending Procedure Description</th>
                  <th className="p-3 w-48 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingProcedures.slice(0, 8).map((proc, idx) => (
                  <tr key={proc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 text-center font-medium text-slate-500">{idx + 1}</td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800">
                        {proc.category}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-900 leading-relaxed">
                      {proc.procedure}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            onStatusChange(proc.id, 'DONE');
                            if (teamMembers.length > 0 && (!proc.performedBy || proc.performedBy === '')) {
                              onAssigneeChange(proc.id, teamMembers[0]);
                            }
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                          title="Mark Done with default member"
                        >
                          Mark Done
                        </button>
                        <button
                          onClick={() => onStatusChange(proc.id, 'NA')}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
                          title="Mark NA"
                        >
                          Mark NA
                        </button>
                        <button
                          onClick={() => onJumpToProcedure(proc.id)}
                          className="p-1 text-slate-400 hover:text-blue-700 transition-colors"
                          title="Jump to item in checklist"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pendingProcedures.length > 8 && (
              <div className="p-3 bg-slate-50 text-center border-t border-slate-100 text-xs text-slate-500">
                + {pendingProcedures.length - 8} more pending procedures.{' '}
                <button
                  onClick={() => onNavigateToGroup('ALL', 'PENDING')}
                  className="text-blue-700 font-bold hover:underline"
                >
                  View all in checklist
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
