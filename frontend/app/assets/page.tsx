"use client";

import { useCallback, useEffect, useState } from "react";
import { assetsApi, categoriesApi } from "@/lib/api";
import { Asset, AssetCategory, AssetStatus, AssetStatusColor, AssetStatusLabel, CreateAssetDto, UpdateAssetDto } from "@/types";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";

export default function AssetsPage() {
    const { showToast } = useToast();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [categories, setCategories] = useState<AssetCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<AssetStatus | "">("");
    const [filterCategory, setFilterCategory] = useState("");
    const [modal, setModal] = useState<"create" | "edit" | "delete" | "history" | null>(null);
    const [selected, setSelected] = useState<Asset | null>(null);
    const [form, setForm] = useState<CreateAssetDto>({ name: "", serialNumber: "", categoryId: "" });
    const [saving, setSaving] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        Promise.all([
            assetsApi.getAll({
                search: search || undefined,
                status: filterStatus !== "" ? filterStatus : undefined,
                categoryId: filterCategory || undefined,
            }),
            categoriesApi.getAll(),
        ])
            .then(([a, c]) => { setAssets(a); setCategories(c); })
            .catch(() => showToast("Failed to load assets", "error"))
            .finally(() => setLoading(false));
    }, [search, filterStatus, filterCategory, showToast]);

    useEffect(() => { load(); }, [load]);

    const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

    const openCreate = () => {
        setForm({ name: "", serialNumber: "", categoryId: categories[0]?.id ?? "" });
        setModal("create");
    };
    const openEdit = (a: Asset) => {
        setSelected(a);
        setForm({ name: a.name, serialNumber: a.serialNumber ?? "", categoryId: a.categoryId });
        setModal("edit");
    };
    const openDelete = (a: Asset) => { setSelected(a); setModal("delete"); };
    const closeModal = () => { setModal(null); setSelected(null); };

    const handleSave = async () => {
        if (!form.name.trim()) return showToast("Name is required", "error");
        if (!form.categoryId) return showToast("Please select a category", "error");
        setSaving(true);
        try {
            if (modal === "create") {
                await assetsApi.create(form);
                showToast("Asset created");
            } else if (modal === "edit" && selected) {
                await assetsApi.update(selected.id, form as UpdateAssetDto);
                showToast("Asset updated");
            }
            closeModal();
            load();
        } catch {
            showToast("Failed to save asset", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selected) return;
        setSaving(true);
        try {
            await assetsApi.delete(selected.id);
            showToast("Asset deleted");
            closeModal();
            load();
        } catch {
            showToast("Failed to delete asset", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Assets</h1>
                    <p className="page-subtitle">Track all hardware and resources</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate}>+ New Asset</button>
            </div>

            {/* Toolbar */}
            <div className="toolbar">
                <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        className="form-input"
                        style={{ paddingLeft: "2.25rem" }}
                        placeholder="Search assets…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select className="form-select" style={{ width: "auto", minWidth: 150 }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value === "" ? "" : Number(e.target.value) as AssetStatus)}>
                    <option value="">All Statuses</option>
                    <option value={AssetStatus.Available}>Available</option>
                    <option value={AssetStatus.Assigned}>Assigned</option>
                    <option value={AssetStatus.UnderMaintenance}>Under Maintenance</option>
                    <option value={AssetStatus.Retired}>Retired</option>
                </select>
                <select className="form-select" style={{ width: "auto", minWidth: 150 }} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Serial Number</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Assigned To</th>
                            <th style={{ width: 100 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {[...Array(6)].map((_, j) => (
                                        <td key={j}><div className="skeleton" style={{ height: 16, width: "70%" }} /></td>
                                    ))}
                                </tr>
                            ))
                        ) : assets.length === 0 ? (
                            <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">📦</div>No assets found. Create one or adjust your filters.</div></td></tr>
                        ) : (
                            assets.map((a) => (
                                <tr key={a.id}>
                                    <td className="primary-cell">{a.name}</td>
                                    <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{a.serialNumber || <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                                    <td>{a.categoryName || catName(a.categoryId)}</td>
                                    <td>
                                        <span className={`badge ${AssetStatusColor[a.status]}`}>
                                            {AssetStatusLabel[a.status]}
                                        </span>
                                    </td>
                                    <td>{a.currentEmployeeName || <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                                    <td>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <button className="btn-icon" onClick={() => openEdit(a)} title="Edit">✏️</button>
                                            <button className="btn-icon danger" onClick={() => openDelete(a)} title="Delete">🗑</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {(modal === "create" || modal === "edit") && (
                <Modal title={modal === "create" ? "New Asset" : "Edit Asset"} onClose={closeModal}>
                    <div className="form-group">
                        <label className="form-label">Asset Name *</label>
                        <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. MacBook Pro 14" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Serial Number</label>
                        <input className="form-input" value={form.serialNumber ?? ""} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} placeholder="e.g. C02X1234JGH7" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Category *</label>
                        <select className="form-select" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                            <option value="">— Select Category —</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
                    </div>
                </Modal>
            )}

            {modal === "delete" && selected && (
                <Modal title="Delete Asset" onClose={closeModal}>
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
