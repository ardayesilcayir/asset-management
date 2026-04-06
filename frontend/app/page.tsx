"use client";

import { useEffect, useState } from "react";
import { dashboardApi } from "@/lib/api";
import { DashboardStats } from "@/types";

function StatCard({
  label,
  value,
  icon,
  color,
  loading,
}: {
  label: string;
  value: number | undefined;
  icon: string;
  color: string;
  loading: boolean;
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ background: color }}>
        <span style={{ fontSize: "1.2rem" }}>{icon}</span>
      </div>
      {loading ? (
        <div className="skeleton" style={{ height: "2rem", width: "60%" }} />
      ) : (
        <div className="stat-card-value">{value ?? 0}</div>
      )}
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Assets", value: stats?.totalAssets, icon: "📦", color: "rgba(99,102,241,0.15)" },
    { label: "Available", value: stats?.availableAssets, icon: "✅", color: "rgba(16,185,129,0.15)" },
    { label: "Assigned", value: stats?.assignedAssets, icon: "🔗", color: "rgba(59,130,246,0.15)" },
    { label: "Employees", value: stats?.totalEmployees, icon: "👥", color: "rgba(245,158,11,0.15)" },
    { label: "Departments", value: stats?.totalDepartments, icon: "🏢", color: "rgba(139,92,246,0.15)" },
    { label: "Categories", value: stats?.totalCategories, icon: "🗂️", color: "rgba(236,72,153,0.15)" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your asset management system</p>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} loading={loading} />
        ))}
      </div>

      <div className="card" style={{ marginTop: "0.5rem" }}>
        <h2 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.75rem", marginTop: 0 }}>
          Quick Guide
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
          {[
            { icon: "🗂️", title: "Create Categories", desc: "Start by creating asset categories to group your equipment." },
            { icon: "🏢", title: "Add Departments", desc: "Set up departments for your organizational structure." },
            { icon: "👥", title: "Register Employees", desc: "Add employees to departments so you can assign assets to them." },
            { icon: "📦", title: "Add Assets", desc: "Register physical assets with serial numbers and categories." },
            { icon: "🔗", title: "Assign Assets", desc: "Assign assets to employees and track their return." },
          ].map((step) => (
            <div
              key={step.title}
              style={{
                background: "var(--bg-elevated)",
                borderRadius: 10,
                padding: "0.875rem",
                border: "1px solid var(--border-muted)",
              }}
            >
              <div style={{ fontSize: "1.3rem", marginBottom: "0.4rem" }}>{step.icon}</div>
              <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                {step.title}
              </div>
              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
