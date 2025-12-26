export type CaseStatus =
  | "draft"
  | "in_review"
  | "favorable"
  | "not_favorable";

export interface Case {
  id: string;
  tramite: string;
  status: CaseStatus;
}

export interface Document {
  id: string;
  caseId: string;
  type: string;
  fileUrl: string;
}
