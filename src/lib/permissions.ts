export type AdminRole = "admin" | "legal" | "reader";

export const PERMISSIONS: Record<
  AdminRole,
  {
    viewCases: boolean;
    evaluateCases: boolean;
    manageAdmins: boolean;
  }
> = {
  admin: {
    viewCases: true,
    evaluateCases: true,
    manageAdmins: true,
  },
  legal: {
    viewCases: true,
    evaluateCases: true,
    manageAdmins: false,
  },
  reader: {
    viewCases: true,
    evaluateCases: false,
    manageAdmins: false,
  },
};
