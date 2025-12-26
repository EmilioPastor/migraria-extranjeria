export type CaseStatus =
  | "draft"
  | "in_review"
  | "favorable"
  | "not_favorable";

interface MockCase {
  id: string;
  tramite: string;
  status: CaseStatus;
  message?: string;
}

export const mockCase: MockCase = {
  id: "demo-case",
  tramite: "Arraigo social",
  status: "in_review",
};
