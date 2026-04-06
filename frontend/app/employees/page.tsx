"use client";

import { useCallback, useEffect, useState } from "react";
import { departmentsApi, employeesApi } from "@/lib/api";
import { Department, Employee, CreateEmployeeDto, UpdateEmployeeDto } from "@/types";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";

export default function EmployeesPage() {
    const { showToast } = useToast();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<"create" | "edit" | "delete" | null>(null);
    const [selected, setSelected] = useState<Employee | null>(null);
    const [form, setForm] = useState<CreateEmployeeDto>({ firstName: "", lastName: "", email: "", phone: "", departmentId: "" });
    const [saving, setSaving] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        Promise.all([employeesApi.getAll(), departmentsApi.getAll()])
            .then(([emps, deps]) => { setEmployees(emps); setDepartments(deps); })
            .catch(() => showToast("Failed to load employees", "error"))
            .finally(() => setLoading(false));
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    const deptName = (id: string) => departments.find((d) => d.id === id)?.name ?? "—";

    const openCreate = () => {
        setForm({ firstName: "", lastName: "", email: "", phone: "", departmentId: departments[0]?.id ?? "" });
        setModal("create");
    };
    const openEdit = (e: Employee) => {
        setSelected(e);
        setForm({ firstName: e.firstName, lastName: e.lastName, email: e.email ?? "", phone: e.phone ?? "", departmentId: e.departmentId });
        setModal("edit");
    };
    const openDelete = (e: Employee) => { setSelected(e); setModal("delete"); };
    const closeModal = () => { setModal(null); setSelected(null); };

    const handleSave = async () => {
        if (!form.firstName.trim() || !form.lastName.trim()) return showToast("First and last name are required", "error");
        if (!form.departmentId) return showToast("Please select a department", "error");
        setSaving(true);
        try {
            if (modal === "create") {
                await employeesApi.create(form);
                showToast("Employee created");
            } else if (modal === "edit" && selected) {
                await employeesApi.update(selected.id, form as UpdateEmployeeDto);
                showToast("Employee updated");
            }
            closeModal();
            load();
        } catch {
            showToast("Failed to save employee", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selected) return;
        setSaving(true);
        try {
            await employeesApi.delete(selected.id);
            showToast("Employee deleted");
            closeModal();
            load();
        } catch {
            showToast("Failed to delete employee", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Employees</h1>
                    <p className="page-subtitle">Manage staff and department assignments</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate}>+ New Employee</button>
            </div>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Department</th>
                            <th style={{ width: 80 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {[...Array(5)].map((_, j) => (
                                        <td key={j}><div className="skeleton" style={{ height: 16, width: "70%" }} /></td>
                                    ))}
                                </tr>
                            ))
                        ) : employees.length === 0 ? (
                            <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">👥</div>No employees yet. Add one to get started.</div></td></tr>
                        ) : (
                            employees.map((e) => (
                                <tr key={e.id}>
                                    <td className="primary-cell">{e.firstName} {e.lastName}</td>
                                    <td>{e.email || <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                                    <td>{e.phone || <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                                    <td>
                                        <span style={{
                                            background: "rgba(99,102,241,0.12)",
                                            color: "#a5b4fc",
                                            borderRadius: 20,
                                            padding: "0.2rem 0.6rem",
                                            fontSize: "0.75rem",
                                            fontWeight: 500,
                                        }}>
                                            {e.departmentName || deptName(e.departmentId)}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <button className="btn-icon" onClick={() => openEdit(e)} title="Edit">✏️</button>
                                            <button className="btn-icon danger" onClick={() => openDelete(e)} title="Delete">🗑</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {(modal === "create" || modal === "edit") && (
                <Modal title={modal === "create" ? "New Employee" : "Edit Employee"} onClose={closeModal}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
                        <div className="form-group">
                            <label className="form-label">First Name *</label>
                            <input className="form-input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="John" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name *</label>
                            <input className="form-input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Doe" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input className="form-input" type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@company.com" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input className="form-input" type="tel" value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+90 555 000 0000" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Department *</label>
                        <select className="form-select" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
                            <option value="">— Select Department —</option>
                            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
                    </div>
                </Modal>
            )}

            {modal === "delete" && selected && (
                <Modal title="Delete Employee" onClose={closeModal}>
                    <p style={{ color: "var(--text-secondary)", margin: "0 0 1.25rem" }}>
                        Are you sure you want to delete <strong style={{ color: "var(--text-primary)" }}>{selected.firstName} {selected.lastName}</strong>? This action cannot be undone.
                    </p>
                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                        <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>{saving ? "Deleting…" : "Delete"}</button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
