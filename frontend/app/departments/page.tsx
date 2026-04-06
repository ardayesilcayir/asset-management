"use client";

import { useCallback, useEffect, useState } from "react";
import { departmentsApi } from "@/lib/api";
import { Department, CreateDepartmentDto } from "@/types";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";

export default function DepartmentsPage() {
    const { showToast } = useToast();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<"create" | "edit" | "delete" | null>(null);
    const [selected, setSelected] = useState<Department | null>(null);
    const [form, setForm] = useState<CreateDepartmentDto>({ name: "", description: "" });
    const [saving, setSaving] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        departmentsApi.getAll().then(setDepartments).catch(() => showToast("Failed to load departments", "error")).finally(() => setLoading(false));
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    const openCreate = () => { setForm({ name: "", description: "" }); setModal("create"); };
    const openEdit = (d: Department) => { setSelected(d); setForm({ name: d.name, description: d.description ?? "" }); setModal("edit"); };
    const openDelete = (d: Department) => { setSelected(d); setModal("delete"); };
    const closeModal = () => { setModal(null); setSelected(null); };

    const handleSave = async () => {
        if (!form.name.trim()) return showToast("Name is required", "error");
        setSaving(true);
        try {
            if (modal === "create") {
                await departmentsApi.create(form);
                showToast("Department created");
            } else if (modal === "edit" && selected) {
                await departmentsApi.update(selected.id, form);
                showToast("Department updated");
            }
            closeModal();
            load();
        } catch {
            showToast("Failed to save department", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selected) return;
        setSaving(true);
        try {
            await departmentsApi.delete(selected.id);
            showToast("Department deleted");
            closeModal();
            load();
        } catch {
            showToast("Failed to delete department", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Departments</h1>
                    <p className="page-subtitle">Manage your organizational structure</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate}>+ New Department</button>
            </div>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th style={{ width: 80 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {[...Array(3)].map((_, j) => (
                                        <td key={j}><div className="skeleton" style={{ height: 16, width: "70%" }} /></td>
                                    ))}
                                </tr>
                            ))
                        ) : departments.length === 0 ? (
                            <tr><td colSpan={3}><div className="empty-state"><div className="empty-icon">🏢</div>No departments yet. Add one to get started.</div></td></tr>
                        ) : (
                            departments.map((d) => (
                                <tr key={d.id}>
                                    <td className="primary-cell">{d.name}</td>
                                    <td>{d.description || <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                                    <td>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <button className="btn-icon" onClick={() => openEdit(d)} title="Edit">✏️</button>
                                            <button className="btn-icon danger" onClick={() => openDelete(d)} title="Delete">🗑</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {(modal === "create" || modal === "edit") && (
                <Modal title={modal === "create" ? "New Department" : "Edit Department"} onClose={closeModal}>
                    <div className="form-group">
                        <label className="form-label">Name *</label>
                        <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Engineering" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea className="form-textarea" value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
                    </div>
                </Modal>
            )}

            {modal === "delete" && selected && (
                <Modal title="Delete Department" onClose={closeModal}>
                    <p style={{ color: "var(--text-secondary)", margin: "0 0 1.25rem" }}>
                        Are you sure you want to delete <strong style={{ color: "var(--text-primary)" }}>{selected.name}</strong>? This action cannot be undone.
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
