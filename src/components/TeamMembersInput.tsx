import React from 'react';
import { Users, UserPlus, Info } from 'lucide-react';

interface TeamMembersInputProps {
  rawInput: string;
  onInputChange: (val: string) => void;
  parsedMembers: string[];
}

export const TeamMembersInput: React.FC<TeamMembersInputProps> = ({
  rawInput,
  onInputChange,
  parsedMembers,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-800">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Audit Team Members</h2>
            <p className="text-xs text-slate-500">
              Enter names separated by commas (used in dropdowns for Done procedures)
            </p>
          </div>
        </div>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
          {parsedMembers.length} {parsedMembers.length === 1 ? 'member' : 'members'} detected
        </span>
      </div>

      <div className="relative">
        <input
          id="team-members-input"
          type="text"
          value={rawInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="e.g. Mr Amit Sharma, Ms Riya Gupta, CA Neha Das"
          className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-800 focus:border-blue-800 focus:bg-white transition-colors"
        />
      </div>

      {/* Active members pill list */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {parsedMembers.length > 0 ? (
          parsedMembers.map((member, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-900 border border-blue-200/60"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span>
              {member}
            </span>
          ))
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-md border border-amber-200">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Please enter at least one team member to assign to completed audit procedures.</span>
          </div>
        )}
      </div>
    </div>
  );
};
