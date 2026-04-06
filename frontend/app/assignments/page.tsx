"use client";

import { useCallback, useEffect, useState } from "react";
import { assignmentsApi, assetsApi, employeesApi } from "@/lib/api";
import {
    Assignment,
    Asset,
    AssetStatus,
    AssetStatusColor,
    AssetStatusLabel,
    AssignAssetDto,
    Employee,
    ReturnAssetDto,
} from "@/types";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";

export default function AssignmentsPage() {
    const { showToast } = useToast();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<"assign" | "return" | null>(null);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [assignForm, setAssignForm] = useState<AssignAssetDto>({ assetId: "", employeeId: "", notes: "" });
    const [returnForm, setReturnForm] = useState<ReturnAssetDto>({ assignmentId: "", notes: "", returnStatus: AssetStatus.Available });
    const [saving, setSaving] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        Promise.all([
            assignmentsApi.getAll(),
            assetsApi.getAll({ status: AssetStatus.Available }),
            employeesApi.getAll(),
        ])
            .then(([asgns, assets, emps]) => {
                setAssignments(asgns);
                setAvailableAssets(assets);
                setEmployees(emps);
            })
            .catch(() => showToast("Failed to load assignments", "error"))
            .finally(() => setLoading(false));
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    const openAssign = () => {
        setAssignForm({ assetId: availableAssets[0]?.id ?? "", employeeId: employees[0]?.id ?? "", notes: "" });
        setModal("assign");
    };

    const openReturn = (a: Assignment) => {
        setSelectedAssignment(a);
        setReturnForm({ assignmentId: a.id, notes: "", returnStatus: AssetStatus.Available });
        setModal("return");
    };

    const closeModal = () => { setModal(null); setSelectedAssignment(null); };

    const handleAssign = async () => {
        if (!assignForm.assetId) return showToast("Please select an asset", "error");
        if (!assignForm.employeeId) return showToast("Please select an employee", "error");
        setSaving(true);
        try {
            await assignmentsApi.assign(assignForm);
            showToast("Asset assigned successfully");
            closeModal();
            load();
        } catch {
            showToast("Failed to assign asset", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleReturn = async () => {
        setSaving(true);
        try {
            await assignmentsApi.return(returnForm);
            showToast("Asset returned successfully");
            closeModal();
            load();
        } catch {
            showToast("Failed to return asset", "error");
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    const activeAssignments = assignments.filter((a) => !a.returnedAt);
    const returnedAssignments = assignments.filter((a) => a.returnedAt);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Assignments</h1>
                    <p className="page-subtitle">Assign and return assets to/from employees</p>
                </div>
                <button className="btn btn-primary" onClick={openAssign} disabled={availableAssets.length === 0}>
                    🔗 Assign Asset
                </button>
            </div>

            {/* Active Assignments */}
            <h2 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                Active Assignments ({activeAssignments.length})
            </h2>
            <div className="table-wrap" style={{ marginBottom: "1.5rem" }}>
                <table>
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Employee</th>
                            <th>Assigned Date</th>
                            <th>Notes</th>
                            <th style={{ width: 100 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <tr key={i}>
                                    {[...Array(5)].map((_, j) => (
                                        <td key={j}><div className="skeleton" style={{ height: 16, width: "70%" }} /></td>
                                    ))}
                                </tr>
                            ))
                        ) : activeAssignments.length === 0 ? (
                            <tr>
                                <td colSpan={5}>
                                    <div className="empty-state">
                                        <div className="empty-icon">🔗</div>
                                        No active assignments. Use the button above to assign an asset.
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            activeAssignments.map((a) => (
                                <tr key={a.id}>
                                    <td className="primary-cell">{a.assetName || a.assetId}</td>
                                    <td>{a.employeeName || a.employeeId}</td>
                                    <td style={{ fontSize: "0.8rem" }}>{formatDate(a.assignedAt)}</td>
                                    <td style={{ fontSize: "0.8rem" }}>{a.notes || <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                                    <td>
                                        <button className="btn btn-secondary" style={{ fontSize: "0.78rem", padding: "0.3rem 0.7rem" }} onClick={() => openReturn(a)}>
                                            ↩ Return
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Returned Assignments */}
            {returnedAssignments.length > 0 && (
                <>
                    <h2 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                        Return History ({returnedAssignments.length})
                    </h2>
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Asset</th>
                                    <th>Employee</th>
                                    <th>Assigned</th>
                                    <th>Returned</th>
                                    <th>Return Status</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {returnedAssignments.map((a) => (
                                    <tr key={a.id}>
                                        <td className="primary-cell">{a.assetName || a.assetId}</td>
                                        <td>{a.employeeName || a.employeeId}</td>
                                        <td style={{ fontSize: "0.8rem" }}>{formatDate(a.assignedAt)}</td>
                                        <td style={{ fontSize: "0.8rem" }}>{a.returnedAt ? formatDate(a.returnedAt) : "—"}</td>
                                        <td>
                                            {a.returnStatus != null ? (
                                                <span className={`badge ${AssetStatusColor[a.returnStatus]}`}>
                                                    {AssetStatusLabel[a.returnStatus]}
                                                </span>
                                            ) : (
                                                <span style={{ color: "var(--text-muted)" }}>—</span>
                                            )}
                                        </td>
                                        <td style={{ fontSize: "0.8rem" }}>{a.notes || <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Assign Modal */}
            {modal === "assign" && (
                <Modal title="Assign Asset to Employee" onClose={closeModal}>
                    <div className="form-group">
                        <label className="form-label">Asset *</label>
                        <select className="form-select" value={assignForm.assetId} onChange={(e) => setAssignForm({ ...assignForm, assetId: e.target.value })}>
                            <option value="">— Select Asset —</option>
                            {availableAssets.map((a) => (
                                <option key={a.id} value={a.id}>{a.name} {a.serialNumber ? `(${a.serialNumber})` : ""}</option>
                            ))}
                        </select>
                        {availableAssets.length === 0 && (
                            <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", margin: "0.25rem 0 0" }}>
                                No available assets. Add assets or return currently assigned ones.
                            </p>
                        )}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Employee *</label>
                        <select className="form-select" value={assignForm.employeeId} onChange={(e) => setAssignForm({ ...assignForm, employeeId: e.target.value })}>
                            <option value="">— Select Employee —</option>
                            {employees.map((e) => (
                                <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Notes</label>
                        <textarea className="form-textarea" value={assignForm.notes ?? ""} onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })} placeholder="Optional notes about this assignment" />
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleAssign} disabled={saving}>{saving ? "Assigning…" : "Assign"}</button>
                    </div>
                </Modal>
            )}

            {/* Return Modal */}
            {modal === "return" && selectedAssignment && (
                <Modal title="Return Asset" onClose={closeModal}>
                    <div style={{ background: "var(--bg-elevated)", borderRadius: 8, padding: "0.75rem", marginBottom: "1rem", fontSize: "0.85rem" }}>
                        <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>Returning asset:</div>
                        <div style={{ color: "var(--text-primary)", fontWeight: 600 }}>{selectedAssignment.assetName}</div>
                        <div style={{ color: "var(--text-secondary)" }}>from {selectedAssignment.employeeName}</div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Return Status *</label>
                        <select
                            className="form-select"
                            value={returnForm.returnStatus}
                            onChange={(e) => setReturnForm({ ...returnForm, returnStatus: Number(e.target.value) as AssetStatus })}
                        >
                            <option value={AssetStatus.Available}>Available (Good condition)</option>
                            <option value={AssetStatus.UnderMaintenance}>Under Maintenance (Needs repair)</option>
                            <option value={AssetStatus.Retired}>Retired (End of life)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Notes</label>
                        <textarea className="form-textarea" value={returnForm.notes ?? ""} onChange={(e) => setReturnForm({ ...returnForm, notes: e.target.value })} placeholder="e.g. Minor scratches on the lid" />
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleReturn} disabled={saving}>{saving ? "Returning…" : "Confirm Return"}</button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
