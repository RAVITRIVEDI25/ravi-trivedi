import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  HeadingLevel,
} from 'docx';
import { saveAs } from 'file-saver';
import { AuditProcedure, EntityInfo } from '../types';

export function formatDoneRemarks(performedBy: string, procedureText: string): string {
  const cleanName = performedBy.trim() || 'Team Member';
  const cleanProc = procedureText.trim();
  return `${cleanName} did the work of ${cleanProc} and there was no adverse findings.`;
}

export function formatNaRemarks(): string {
  return 'Not Applicable to this entity / engagement for the audited financial year.';
}

const PRIMARY_COLOR = '1B365D'; // Deep Navy from ICAI working paper
const SECONDARY_COLOR = '2C5282'; // Slate blue
const ACCENT_BG = 'F0F4F8'; // Light slate background for alternate rows/subheaders
const BORDER_COLOR = 'D1D5DB';
const FONT_FAMILY = 'Calibri';

const cellBorder = {
  top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
  left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
  right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
};

export async function generateWorkingPaperDocx(
  entityInfo: EntityInfo,
  procedures: AuditProcedure[],
  teamMembers: string[],
): Promise<void> {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_FAMILY,
            size: 20, // 10pt
            color: '1F2937',
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY_COLOR },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 70, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `${entityInfo.auditFirmName.toUpperCase()} — AUDIT WORKING PAPER`,
                                bold: true,
                                size: 17,
                                color: PRIMARY_COLOR,
                                font: FONT_FAMILY,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: 30, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new TextRun({
                                text: 'CONFIDENTIAL',
                                bold: true,
                                size: 17,
                                color: 'C53030', // Burgundy red
                                font: FONT_FAMILY,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new Paragraph({ text: '' }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 70, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: 'For Internal Audit Use Only — Do Not Circulate',
                                italics: true,
                                size: 16,
                                color: '6B7280',
                                font: FONT_FAMILY,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: 30, type: WidthType.PERCENTAGE },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new TextRun({
                                text: 'Page ',
                                size: 16,
                                color: '6B7280',
                                font: FONT_FAMILY,
                              }),
                              new TextRun({
                                children: [PageNumber.CURRENT],
                                size: 16,
                                color: '6B7280',
                                font: FONT_FAMILY,
                              }),
                              new TextRun({
                                text: ' of ',
                                size: 16,
                                color: '6B7280',
                                font: FONT_FAMILY,
                              }),
                              new TextRun({
                                children: [PageNumber.TOTAL_PAGES],
                                size: 16,
                                color: '6B7280',
                                font: FONT_FAMILY,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Cover Header Box
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'AUDIT WORKING PAPER',
                bold: true,
                size: 38,
                color: PRIMARY_COLOR,
                font: FONT_FAMILY,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `${entityInfo.auditFirmName}`,
                bold: true,
                size: 24,
                color: SECONDARY_COLOR,
                font: FONT_FAMILY,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Audit of ${entityInfo.entityName} | FY: ${entityInfo.financialYear} | Framework: ${entityInfo.reportingFramework}`,
                italics: true,
                size: 19,
                color: '4B5563',
                font: FONT_FAMILY,
              }),
            ],
          }),

          // PART A: ENTITY INFORMATION
          createSectionHeader('PART A — ENTITY INFORMATION & ENGAGEMENT DETAILS'),
          createEntityInfoTable(entityInfo, teamMembers),

          new Paragraph({ text: '', spacing: { before: 200, after: 100 } }),

          // PART B: AUDIT PROCEDURES CHECKLIST
          createSectionHeader('PART B — AUDIT PROCEDURES CHECKLIST & FINDINGS'),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'Instructions: ',
                bold: true,
                size: 18,
                color: PRIMARY_COLOR,
              }),
              new TextRun({
                text: 'All procedures have been evaluated and marked as Done or NA (Not Applicable). For each Done procedure, the auditor who performed the work is indicated along with the findings confirmation. Standard audit assertions verified include Completeness, Accuracy, Existence, Rights & Obligations, Valuation, Cut-off, Presentation & Disclosure.',
                size: 18,
                color: '374151',
              }),
            ],
          }),

          // Balance Sheet Section
          ...createGroupProceduresSection(
            '1. BALANCE SHEET PROCEDURES',
            procedures.filter((p) => p.group === 'balance_sheet'),
          ),

          // Profit and Loss Section
          ...createGroupProceduresSection(
            '2. PROFIT AND LOSS PROCEDURES',
            procedures.filter((p) => p.group === 'profit_and_loss'),
          ),

          // Compliance Section
          ...createGroupProceduresSection(
            '3. COMPLIANCE & REPORTING PROCEDURES',
            procedures.filter((p) => p.group === 'compliance'),
          ),

          // Other Audit Areas Section
          ...createGroupProceduresSection(
            '4. OTHER AUDIT AREAS PROCEDURES',
            procedures.filter((p) => p.group === 'other_areas'),
          ),

          new Paragraph({ text: '', spacing: { before: 240, after: 100 } }),

          // PART C: OVERALL CONCLUSION & SIGN-OFF
          createSectionHeader('PART C — OVERALL CONCLUSION & SIGN-OFF'),
          createConclusionTable(entityInfo),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const sanitizedEntity = entityInfo.entityName.replace(/[^a-zA-Z0-9_-]/g, '_');
  saveAs(blob, `Audit_Working_Paper_${sanitizedEntity}_FY${entityInfo.financialYear}.docx`);
}

function createSectionHeader(title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    heading: HeadingLevel.HEADING_2,
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 24,
        color: PRIMARY_COLOR,
        font: FONT_FAMILY,
      }),
    ],
  });
}

function createEntityInfoTable(info: EntityInfo, teamMembers: string[]): Table {
  const rowPairs: [string, string, string, string][] = [
    ['Name of Entity', info.entityName, 'Financial Year', info.financialYear],
    ['Type of Entity', info.entityType, 'Audit Type', info.auditType],
    ['Registered Address', info.registeredAddress, 'PAN / TAN', info.panTan],
    ['CIN / Registration No.', info.cinLlpin, 'Reporting Framework', info.reportingFramework],
    ['Audit Firm Name', info.auditFirmName, 'Engagement Partner', info.engagementPartner],
    ['Audit Team Members', teamMembers.join(', ') || 'None specified', 'Date of Commencement', info.dateOfCommencement],
    ['Target Report Date', info.targetReportDate, 'Actual Report Date', info.actualReportDate],
    ['Board Meeting Date', info.boardMeetingDate, 'AGM / Signing Date', info.agmDate],
  ];

  const rows = rowPairs.map((pair, idx) => {
    const isEven = idx % 2 === 0;
    const bgColor = isEven ? 'FFFFFF' : ACCENT_BG;

    return new TableRow({
      children: [
        new TableCell({
          width: { size: 22, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          shading: { fill: 'E2E8F0' },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: pair[0],
                  bold: true,
                  size: 18,
                  color: PRIMARY_COLOR,
                  font: FONT_FAMILY,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 28, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          shading: { fill: bgColor },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: pair[1] || '-',
                  size: 18,
                  font: FONT_FAMILY,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 22, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          shading: { fill: 'E2E8F0' },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: pair[2],
                  bold: true,
                  size: 18,
                  color: PRIMARY_COLOR,
                  font: FONT_FAMILY,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 28, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          shading: { fill: bgColor },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: pair[3] || '-',
                  size: 18,
                  font: FONT_FAMILY,
                }),
              ],
            }),
          ],
        }),
      ],
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: cellBorder,
    rows: rows,
  });
}

function createGroupProceduresSection(groupTitle: string, procedures: AuditProcedure[]): (Paragraph | Table)[] {
  if (procedures.length === 0) return [];

  const elements: (Paragraph | Table)[] = [];

  elements.push(
    new Paragraph({
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({
          text: groupTitle,
          bold: true,
          size: 21,
          color: SECONDARY_COLOR,
          font: FONT_FAMILY,
        }),
      ],
    }),
  );

  // Group procedures by category
  const categories: string[] = [];
  procedures.forEach((p) => {
    if (!categories.includes(p.category)) {
      categories.push(p.category);
    }
  });

  for (const category of categories) {
    const catProcedures = procedures.filter((p) => p.category === category);
    elements.push(createCategoryTable(category, catProcedures));
    elements.push(new Paragraph({ text: '', spacing: { after: 100 } }));
  }

  return elements;
}

function createCategoryTable(categoryName: string, procedures: AuditProcedure[]): Table {
  const tableRows: TableRow[] = [];

  // Category Banner Row
  tableRows.push(
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 5,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: cellBorder,
          shading: { fill: PRIMARY_COLOR },
          children: [
            new Paragraph({
              spacing: { before: 60, after: 60 },
              children: [
                new TextRun({
                  text: categoryName,
                  bold: true,
                  color: 'FFFFFF',
                  size: 20,
                  font: FONT_FAMILY,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  );

  // Header Row
  tableRows.push(
    new TableRow({
      children: [
        createHeaderCell('S.No', 6),
        createHeaderCell('Audit Procedure', 40),
        createHeaderCell('Status', 10),
        createHeaderCell('Performed By', 16),
        createHeaderCell('Remarks / Findings', 28),
      ],
    }),
  );

  // Procedure Rows
  procedures.forEach((proc, index) => {
    const isEven = index % 2 === 0;
    const rowBg = isEven ? 'FFFFFF' : 'F9FAFB';

    let remarksText = '';
    if (proc.customRemarks && proc.customRemarks.trim()) {
      remarksText = proc.customRemarks;
    } else if (proc.status === 'DONE') {
      remarksText = formatDoneRemarks(proc.performedBy || 'Assigned Staff', proc.procedure);
    } else if (proc.status === 'NA') {
      remarksText = formatNaRemarks();
    } else {
      remarksText = 'Pending review';
    }

    const statusText = proc.status === 'DONE' ? 'DONE' : proc.status === 'NA' ? 'N/A' : 'PENDING';
    const statusColor =
      proc.status === 'DONE' ? '15803D' : proc.status === 'NA' ? '4B5563' : 'B45309';

    tableRows.push(
      new TableRow({
        children: [
          // S.No
          new TableCell({
            width: { size: 6, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            shading: { fill: rowBg },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${index + 1}`,
                    bold: true,
                    size: 18,
                    font: FONT_FAMILY,
                  }),
                ],
              }),
            ],
          }),
          // Procedure
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            shading: { fill: rowBg },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: proc.procedure,
                    size: 18,
                    font: FONT_FAMILY,
                  }),
                ],
              }),
            ],
          }),
          // Status
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            shading: { fill: rowBg },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: statusText,
                    bold: true,
                    size: 17,
                    color: statusColor,
                    font: FONT_FAMILY,
                  }),
                ],
              }),
            ],
          }),
          // Performed By
          new TableCell({
            width: { size: 16, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            shading: { fill: rowBg },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: proc.status === 'DONE' ? proc.performedBy || 'Not specified' : 'N/A',
                    italics: proc.status !== 'DONE',
                    bold: proc.status === 'DONE',
                    size: 18,
                    color: proc.status === 'DONE' ? '1F2937' : '6B7280',
                    font: FONT_FAMILY,
                  }),
                ],
              }),
            ],
          }),
          // Remarks
          new TableCell({
            width: { size: 28, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            shading: { fill: rowBg },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: remarksText,
                    size: 17,
                    font: FONT_FAMILY,
                    color: proc.status === 'DONE' ? '1F2937' : '4B5563',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    );
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: cellBorder,
    rows: tableRows,
  });
}

function createHeaderCell(text: string, widthPercent: number): TableCell {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    borders: cellBorder,
    shading: { fill: 'CBD5E1' }, // Clean slate header
    children: [
      new Paragraph({
        alignment: text === 'S.No' || text === 'Status' ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({
            text,
            bold: true,
            size: 18,
            color: '0F172A',
            font: FONT_FAMILY,
          }),
        ],
      }),
    ],
  });
}

function createConclusionTable(info: EntityInfo): Table {
  const conclusionRows: [string, string][] = [
    ['Overall Audit Conclusion', info.overallConclusion],
    ['Key Observations / Audit Memos Raised', info.keyObservations],
    ['Outstanding Items / Pending Documents', info.outstandingItems],
    ['Management Representation Letter Obtained?', `${info.mrlObtained} (Dated: ${info.mrlDate})`],
    ['Prepared By', `${info.preparedBy} (Date: ${info.signOffDate})`],
    ['Reviewed By (Senior / Manager)', `${info.reviewedBy} (Date: ${info.signOffDate})`],
    ['Approved By (Engagement Partner)', `${info.approvedBy} (Date: ${info.signOffDate})`],
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: cellBorder,
    rows: conclusionRows.map(([label, val], idx) => {
      const isEven = idx % 2 === 0;
      const bg = isEven ? 'FFFFFF' : ACCENT_BG;
      return new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            shading: { fill: 'E2E8F0' },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: label,
                    bold: true,
                    size: 18,
                    color: PRIMARY_COLOR,
                    font: FONT_FAMILY,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            borders: cellBorder,
            shading: { fill: bg },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: val || '-',
                    size: 18,
                    font: FONT_FAMILY,
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    }),
  });
}
