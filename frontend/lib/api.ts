import {
    Asset,
    AssetCategory,
    AssetStatus,
    Assignment,
    AssignAssetDto,
    CreateAssetCategoryDto,
    CreateAssetDto,
    CreateDepartmentDto,
    CreateEmployeeDto,
    DashboardStats,
    Department,
    Employee,
    ReturnAssetDto,
    UpdateAssetDto,
    UpdateEmployeeDto,
} from "@/types";

const BASE = "http://localhost:5012/api";

async function request<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
    }
    const text = await res.text();
    if (!text) return undefined as unknown as T;
    return JSON.parse(text) as T;
}

// ─── Dashboard ───────────────────────────────
export const dashboardApi = {
    getStats: () => request<DashboardStats>("/Dashboard/stats"),
};

// ─── Asset Categories ────────────────────────
export const categoriesApi = {
    getAll: () => request<AssetCategory[]>("/AssetCategories"),
    getById: (id: string) => request<AssetCategory>(`/AssetCategories/${id}`),
    create: (dto: CreateAssetCategoryDto) =>
        request<AssetCategory>("/AssetCategories", {
            method: "POST",
            body: JSON.stringify(dto),
        }),
    update: (id: string, dto: CreateAssetCategoryDto) =>
        request<AssetCategory>(`/AssetCategories/${id}`, {
            method: "PUT",
            body: JSON.stringify(dto),
        }),
    delete: (id: string) =>
        request<void>(`/AssetCategories/${id}`, { method: "DELETE" }),
};

// ─── Assets ──────────────────────────────────
export const assetsApi = {
    getAll: (params?: { search?: string; status?: AssetStatus; categoryId?: string }) => {
        const q = new URLSearchParams();
        if (params?.search) q.set("search", params.search);
        if (params?.status != null) q.set("status", String(params.status));
        if (params?.categoryId) q.set("categoryId", params.categoryId);
        const qs = q.toString();
        return request<Asset[]>(`/Assets${qs ? `?${qs}` : ""}`);
    },
    getById: (id: string) => request<Asset>(`/Assets/${id}`),
    getHistory: (id: string) => request<Assignment[]>(`/Assets/${id}/history`),
    create: (dto: CreateAssetDto) =>
        request<Asset>("/Assets", { method: "POST", body: JSON.stringify(dto) }),
    update: (id: string, dto: UpdateAssetDto) =>
        request<Asset>(`/Assets/${id}`, { method: "PUT", body: JSON.stringify(dto) }),
    delete: (id: string) =>
        request<void>(`/Assets/${id}`, { method: "DELETE" }),
};

// ─── Departments ─────────────────────────────
export const departmentsApi = {
    getAll: () => request<Department[]>("/Departments"),
    getById: (id: string) => request<Department>(`/Departments/${id}`),
    create: (dto: CreateDepartmentDto) =>
        request<Department>("/Departments", {
            method: "POST",
            body: JSON.stringify(dto),
        }),
    update: (id: string, dto: CreateDepartmentDto) =>
        request<Department>(`/Departments/${id}`, {
            method: "PUT",
            body: JSON.stringify(dto),
        }),
    delete: (id: string) =>
        request<void>(`/Departments/${id}`, { method: "DELETE" }),
};

// ─── Employees ───────────────────────────────
export const employeesApi = {
    getAll: () => request<Employee[]>("/Employees"),
    getById: (id: string) => request<Employee>(`/Employees/${id}`),
    create: (dto: CreateEmployeeDto) =>
        request<Employee>("/Employees", {
            method: "POST",
            body: JSON.stringify(dto),
        }),
    update: (id: string, dto: UpdateEmployeeDto) =>
        request<Employee>(`/Employees/${id}`, {
            method: "PUT",
            body: JSON.stringify(dto),
        }),
    delete: (id: string) =>
        request<void>(`/Employees/${id}`, { method: "DELETE" }),
};

// ─── Assignments ─────────────────────────────
export const assignmentsApi = {
    getAll: () => request<Assignment[]>("/Assignments"),
    getByEmployee: (employeeId: string) =>
        request<Assignment[]>(`/Assignments/employee/${employeeId}`),
    assign: (dto: AssignAssetDto) =>
        request<Assignment>("/Assignments/assign", {
            method: "POST",
            body: JSON.stringify(dto),
        }),
    return: (dto: ReturnAssetDto) =>
        request<Assignment>("/Assignments/return", {
            method: "POST",
            body: JSON.stringify(dto),
        }),
};
