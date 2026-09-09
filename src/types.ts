export type ProcedureStatus = 'PENDING' | 'DONE' | 'NA';

export type AuditGroup = 'balance_sheet' | 'profit_and_loss' | 'compliance' | 'other_areas';

export interface AuditProcedure {
  id: string;
  sNo: number;
  group: AuditGroup;
  category: string; // e.g., 'Property, Plant & Equipment (PPE)'
  procedure: string;
  status: ProcedureStatus;
  performedBy?: string;
  customRemarks?: string;
}

export interface EntityInfo {
  entityName: string;
  entityType: string;
  registeredAddress: string;
  panTan: string;
  cinLlpin: string;
  financialYear: string;
  auditFirmName: string;
  engagementPartner: string;
  auditType: string;
  reportingFramework: string;
  dateOfAppointment: string;
  dateOfCommencement: string;
  targetReportDate: string;
  actualReportDate: string;
  boardMeetingDate: string;
  agmDate: string;
  overallConclusion: string;
  keyObservations: string;
  outstandingItems: string;
  mrlObtained: 'Yes' | 'No';
  mrlDate: string;
  preparedBy: string;
  reviewedBy: string;
  approvedBy: string;
  signOffDate: string;
}

export interface ValidationError {
  procedureId: string;
  category: string;
  procedureText: string;
}
