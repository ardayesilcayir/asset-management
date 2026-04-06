// ─────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────
export enum AssetStatus {
  Available = 1,
  Assigned = 2,
  UnderMaintenance = 3,
  Retired = 4,
}

export const AssetStatusLabel: Record<AssetStatus, string> = {
  [AssetStatus.Available]: "Available",
  [AssetStatus.Assigned]: "Assigned",
  [AssetStatus.UnderMaintenance]: "Under Maintenance",
  [AssetStatus.Retired]: "Retired",
};

export const AssetStatusColor: Record<AssetStatus, string> = {
  [AssetStatus.Available]: "text-emerald-400 bg-emerald-400/10",
  [AssetStatus.Assigned]: "text-blue-400 bg-blue-400/10",
  [AssetStatus.UnderMaintenance]: "text-amber-400 bg-amber-400/10",
  [AssetStatus.Retired]: "text-slate-400 bg-slate-400/10",
};

// ─────────────────────────────────────────────
// Entities
// ─────────────────────────────────────────────
export interface AssetCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  departmentId: string;
  departmentName?: string;
}

export interface Asset {
  id: string;
  name: string;
  serialNumber?: string;
  categoryId: string;
  categoryName?: string;
  status: AssetStatus;
  currentEmployeeId?: string;
  currentEmployeeName?: string;
}

export interface Assignment {
  id: string;
  assetId: string;
  assetName?: string;
  employeeId: string;
  employeeName?: string;
  assignedAt: string;
  returnedAt?: string;
  notes?: string;
  returnStatus?: AssetStatus;
}

export interface DashboardStats {
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  totalEmployees: number;
  totalDepartments: number;
  totalCategories: number;
}

// ─────────────────────────────────────────────
// DTOs
// ─────────────────────────────────────────────
export interface CreateAssetCategoryDto {
  name: string;
  description?: string;
}

export interface CreateAssetDto {
  name: string;
  serialNumber?: string;
  categoryId: string;
}

export interface UpdateAssetDto {
  name: string;
  serialNumber?: string;
  categoryId: string;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  departmentId: string;
}

export interface UpdateEmployeeDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  departmentId: string;
}

export interface AssignAssetDto {
  assetId: string;
  employeeId: string;
  notes?: string;
}

export interface ReturnAssetDto {
  assignmentId: string;
  notes?: string;
  returnStatus: AssetStatus;
}
